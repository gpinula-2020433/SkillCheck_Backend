import StudentAnswer from '../student.answer/student.answer.model.js'
import QuestionnaireResult from './questionnaire.result.model.js'
import Questionnaire from '../questionnaire/questionnaire.model.js'

export const generateResult = async (req, res) => {
  try {
    const { studentCourseId, questionnaireId } = req.body

    const answers = await StudentAnswer.find({ studentCourseId, questionnaireId })

    if (!answers || answers.length === 0) {
      return res.status(404).send({ message: 'No answers found for this student and questionnaire' })
    }

    const totalQuestions = answers.length
    const correctAnswers = answers.filter(a => a.isCorrect).length
    const wrongAnswers = totalQuestions - correctAnswers
    const totalPointsObtained = answers.reduce((sum, a) => sum + a.pointsObtained, 0)

    const questionnaire = await Questionnaire.findById(questionnaireId)
    if (!questionnaire) {
      return res.status(404).send({ message: 'Questionnaire not found' })
    }

    let percentage = (totalPointsObtained / questionnaire.maxGrade) * 100
    if (percentage > 100) percentage = 100

    const status = percentage >= questionnaire.passingGrade ? 'Passed' : 'Failed'

    const result = new QuestionnaireResult(
      {
        studentCourseId,
        questionnaireId,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        percentage,
        status,
        completionDate: new Date()
      }
    )

    await result.save()

    return res.status(201).send(
      {
        message: 'Result generated successfully',
        result
      }
    )
  } catch (err) {
    console.error('Error generating result', err)
    return res.status(500).send(
      {
        message: 'Error generating result',
        error: err.message || err
      }
    )
  }
}
