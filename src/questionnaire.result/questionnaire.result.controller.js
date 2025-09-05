import StudentAnswer from '../student.answer/student.answer.model.js'
import QuestionnaireResult from './questionnaire.result.model.js'
import Questionnaire from '../questionnaire/questionnaire.model.js'
import Question from '../question/question.model.js'
import Competence from '../competences/competences.model.js'

export const generateResult = async (studentCourseId, questionnaireId) => {
  try {
    const answers = await StudentAnswer.find({ studentCourseId, questionnaireId })

    if (!answers || answers.length === 0) {
      throw new Error('No answers found for this student and questionnaire')
    }

    const totalQuestions = answers.length
    const correctAnswers = answers.filter((a) => a.isCorrect).length
    const wrongAnswers = totalQuestions - correctAnswers
    const totalPointsObtained = answers.reduce((sum, a) => sum + a.pointsObtained, 0)

    const questionnaire = await Questionnaire.findById(questionnaireId)
    if (!questionnaire) {
      throw new Error('Questionnaire not found')
    }

    let percentage = (totalPointsObtained / questionnaire.maxGrade) * 100
    if (percentage > 100) percentage = 100

    let scoreOverAllowedGrade = (totalPointsObtained / questionnaire.maxAllowedGrade) * 100
    if (scoreOverAllowedGrade > 100) scoreOverAllowedGrade = 100

    const approvalStatus = scoreOverAllowedGrade >= questionnaire.passingGrade ? 'Passed' : 'Failed'

    const weightedScore = (totalPointsObtained / questionnaire.maxGrade) * 100

    let scoreOverMaxGrade = 0
    for (const answer of answers) {
      const question = await Question.findById(answer.questionId)
      if (question) {
        if (answer.isCorrect) {
          scoreOverMaxGrade += question.points
        }
      }
    }

    const competencies = []
    const questionIds = answers.map((answer) => answer.questionId)
    const questions = await Question.find({ questionnaireId })

    const competencyGroups = questions.reduce((groups, question) => {
      if (!groups[question.competencyId]) {
        groups[question.competencyId] = []
      }
      groups[question.competencyId].push(question)
      return groups
    }, {})

    for (let [competencyId, questionsInCompetency] of Object.entries(competencyGroups)) {
      const competencyAnswers = answers.filter((answer) =>
        questionsInCompetency.some((question) => question._id.toString() === answer.questionId.toString())
      )

      const correctInCompetency = competencyAnswers.filter((a) => a.isCorrect).length
      const wrongInCompetency = competencyAnswers.length - correctInCompetency
      const totalQuestionsInCompetency = questionsInCompetency.length
      const competencyPercentage = ((correctInCompetency - wrongInCompetency) / totalQuestionsInCompetency).toFixed(2)

      const competency = await Competence.findById(competencyId)
      if (!competency) {
        console.error(`Competency with ID ${competencyId} not found.`)
        continue
      }

      competencies.push({
        competencyId: competency._id,
        competencyName: competency.competenceName,
        correctAnswers: correctInCompetency,
        wrongAnswers: wrongInCompetency,
        percentage: competencyPercentage
      })
    }

    const result = new QuestionnaireResult({
      studentCourseId,
      questionnaireId,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      percentage,
      status: approvalStatus,
      completionDate: new Date(),
      competencies,
      maxGrade: questionnaire.maxGrade,
      passingGrade: questionnaire.passingGrade,
      maxAllowedGrade: questionnaire.maxAllowedGrade,
      weightOverMaxGrade: questionnaire.weightOverMaxGrade,
      scoreOverMaxGrade,
      scoreOverAllowedGrade,
      approvalStatus,
      weightedScore
    })

    await result.save()
    return result
  } catch (err) {
    console.error('Error generating result', err)
    throw new Error('Error generating result: ' + (err.message || err))
  }
}
