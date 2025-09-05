import Question from './question.model.js'
import Questionnaire from '../questionnaire/questionnaire.model.js'


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
          questionnaireId: q.questionnaireId,
          statement: q.statement,
          type: q.type,
          options,
          points: q.points,
          competencyId: q.competencyId
        }
      } else if (q.type === 'OPEN') {
        
        return {
          _id: q._id,
          questionnaireId: q.questionnaireId,
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
        questionnaireId,
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
