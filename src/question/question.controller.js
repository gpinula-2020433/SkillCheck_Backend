import Question from './question.model.js'
import Questionnaire from '../questionnaire/questionnaire.model.js'

export const createQuestionnaireWithQuestions = async (req, res) => {
  try {
    let { questions, ...questionnaireData } = req.body

    let questionnaire = new Questionnaire(questionnaireData)
    await questionnaire.save()

    let savedQuestions = []
    if (questions && questions.length > 0) {
      for (let q of questions) {
        let question = new Question(
          {
            ...q,
            questionnaireId: questionnaire._id
          }
        )
        await question.save()
        savedQuestions.push(question)
      }
    }

    return res.status(201).send(
      {
        message: 'Questionnaire and questions created successfully',
        questionnaire: questionnaire,
        questions: savedQuestions
      }
    )
  } catch (err) {
    console.error('Error creating questionnaire with questions', err)
    return res.status(500).send(
      {
        message: 'Error creating questionnaire with questions',
        error: err.message || err
      }
    )
  }
}


export const getQuestionsForStudent = async (req, res) => {
  try {
    const {id:questionnaireId} = req.params

    const questions = await Question.find({ questionnaireId }).lean()

    const formattedQuestions = questions.map(q => {
      if (q.type === 'CHOICE') {
        
        const options = q.options.map(opt => (
          {
            _id: opt._id,
            text: opt.text
          }
        ))

        return {
          _id: q._id,
          statement: q.statement,
          type: q.type,
          options,
          points: q.points,
          competencyId: q.competencyId
        }
      } else if (q.type === 'OPEN') {
        
        return {
          _id: q._id,
          statement: q.statement,
          type: q.type,
          points: q.points,
          competencyId: q.competencyId
        }
      }
    })

    return res.status(200).send(
      {
        message: 'Questions retrieved successfully',
        questions: formattedQuestions
      }
    )

  } catch (err) {
    console.error('Error retrieving questions', err)
    return res.status(500).send(
      {
        message: 'Error retrieving questions',
        error: err.message || err
      }
    )
  }
}
