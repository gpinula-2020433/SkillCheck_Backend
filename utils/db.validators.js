import { isValidObjectId } from 'mongoose'
import User from '../src/user/user.model.js'
import StudentAnswer from '../src/student.answer/student.answer.model.js'
import Question from '../src/question/question.model.js'
import StudentCourse from '../src/studentCourse/studentCourse.model.js'


export const existEmail = async (email, user) => {
  const alreadyEmail = await User.findOne({ email })
  if (alreadyEmail && alreadyEmail._id != user.uid) {
    console.error(`El correo electrónico ${email} ya existe`)
    throw new Error(`El correo electrónico ${email} ya existe`)
  }
}

export const notRequiredField = (field) => {
  if (field) {
    throw new Error(`${field} no es requerido`)
  }
}

export const findUser = async (id) => {
  try {
    const userExist = await User.findById(id)
    if (!userExist) return false
    return userExist
  } catch (err) {
    console.error(err)
    return false
  }
}

export const objectIdValid = (objectId) => {
  if (!isValidObjectId(objectId)) {
    throw new Error(`El valor del campo no es un ObjectId válido`)
  }
}

export const validateCreateQuestionnaireWithQuestions = async (req, res, next) => {
  try {
    const { questions, ...questionnaireData } = req.body
    
    if (!questions || questions.length === 0) {
      return res.status(400).send({ message: 'At least one question is required.' })
    }

    const totalPoints = questions.reduce((acc, question) => acc + question.points, 0)

    if (totalPoints !== questionnaireData.maxGrade) {
      return res.status(400).send({
        message: `Total points of the questions (${totalPoints}) must match the maximum grade (${questionnaireData.maxGrade})`
      })
    }

    next()
  } catch (err) {
    console.error('Error in points validation', err)
    return res.status(500).send({
      message: 'Error in points validation',
      error: err.message || err
    })
  }
}

export const checkAnswersAndAttempt = async (req, res, next) => {
  try {
    const { uid } = req.user
    const { answers } = req.body

    if (!answers || answers.length === 0) {
      return res.status(400).send({ message: 'No answers provided' })
    }

   console.log( answers)
    
    const questionnaireId = answers[0]?.questionnaireId
    if (!questionnaireId) {
      return res.status(400).send({ message: 'No questionnaire ID found in the answers' })
    }

    const existingAnswer = await StudentAnswer.findOne({
      studentCourseId: { $in: (await StudentCourse.find({ student: uid })).map(sc => sc._id) },
      questionnaireId: questionnaireId
    })

    if (existingAnswer) {
      return res.status(400).send({ message: 'You have already submitted answers for this questionnaire' })
    }

    const questions = await Question.find({ questionnaireId })
    const answeredQuestionIds = answers.map(answer => answer.questionId)

    for (let question of questions) {
      if (!answeredQuestionIds.includes(question._id.toString())) {
        return res.status(400).send({
          message: `You have not answered question: "${question.statement}" (ID: ${question._id})`
        })
      }

      const answer = answers.find(a => a.questionId.toString() === question._id.toString())
      if (question.type === 'CHOICE' && !answer.selectedOptionId) {
        return res.status(400).send({
          message: `You must select an option for question: "${question.statement}" (ID: ${question._id})`
        })
      } else if (question.type === 'OPEN' && !answer.answerText) {
        return res.status(400).send({
          message: `You must provide an answer for question: "${question.statement}" (ID: ${question._id})`
        })
      }
    }

    next()
  } catch (err) {
    console.error('Error checking answers and attempt', err)
    return res.status(500).send({
      message: 'Error checking answers and attempt',
      error: err.message || err
    })
  }
}
