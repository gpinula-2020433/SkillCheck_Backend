import { isValidObjectId } from 'mongoose'
import User from '../src/user/user.model.js'
import StudentAnswer from '../src/student.answer/student.answer.model.js'
import Question from '../src/question/question.model.js'
import StudentCourse from '../src/studentCourse/studentCourse.model.js'
import Questionnaire from '../src/questionnaire/questionnaire.model.js'

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
      return res.status(400).send({ message: 'Se requiere al menos una pregunta.' })
    }

    const totalPoints = questions.reduce((acc, question) => acc + question.points, 0)

    if (totalPoints !== questionnaireData.maxGrade) {
      return res.status(400).send({
        message: `El total de puntos de las preguntas (${totalPoints}) debe coincidir con la calificación máxima (${questionnaireData.maxGrade})`
      })
    }

    for (let question of questions) {
      if (question.type === 'CHOICE') {
        const correctOption = question.options.find(option => option.isCorrect);
        if (!correctOption) {
          return res.status(400).send({
            message: `La pregunta "${question.statement}" debe tener al menos una opción marcada como correcta.`
          })
        }
      }
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

    const questionnaireId = answers[0]?.questionnaireId
    if (!questionnaireId) {
      return res.status(400).send({ message: 'No questionnaire ID found in the answers' })
    }

    const questionnaire = await Questionnaire.findById(questionnaireId)
    if (!questionnaire) {
      return res.status(404).send({ message: 'Questionnaire not found' })
    }

    const now = new Date()
    if (now > questionnaire.deadline) {
      return res.status(400).send({ 
        message: `El cuestionario "${questionnaire.title}" ya está cerrado y no admite respuestas`
      })
    }

    const existingAnswer = await StudentAnswer.findOne({
      studentCourseId: { $in: (await StudentCourse.find({ student: uid })).map(sc => sc._id) },
      questionnaireId: questionnaireId
    })

    if (existingAnswer) {
      return res.status(400).send({ message: 'You have already submitted answers for this questionnaire' })
    }

    const questions = await Question.find({ questionnaireId })

    for (let question of questions) {
      const answer = answers.find(a => a.questionId.toString() === question._id.toString())
      
      if (question.type === 'CHOICE' && (!answer || !answer.selectedOptionId)) {
        return res.status(400).send({
          message: `Debes seleccionar una opción para la pregunta: "${question.statement}"`
        })
      } else if (question.type === 'OPEN' && (!answer || !answer.answerText)) {
        return res.status(400).send({
          message: `Debes proporcionar una respuesta para la pregunta: "${question.statement}"`
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


