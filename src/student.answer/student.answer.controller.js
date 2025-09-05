import StudentAnswer from './student.answer.model.js'
import Question from '../question/question.model.js'
import { generateResult } from '../questionnaire.result/questionnaire.result.controller.js'
import StudentCourse from '../studentCourse/studentCourse.model.js'
import Questionnaire from '../questionnaire/questionnaire.model.js'

export const submitAnswers = async (req, res) => {
  try {
    const { uid } = req.user
    const data = req.body.answers

    let studentAnswers = []
    let studentCourseId = null
    let questionnaireId = null

    for (let answer of data) {
      if (!questionnaireId) questionnaireId = answer.questionnaireId

      let question = await Question.findById(answer.questionId)
      if (!question) {
        return res.status(404).send({ message: 'Question not found' })
      }

      let questionnaire = await Questionnaire.findById(questionnaireId)
      if (!questionnaire) {
        return res.status(404).send({ message: 'Questionnaire not found' })
      }

      if (!studentCourseId) {
        const studentCourse = await StudentCourse.findOne({
          student: uid,
          course: questionnaire.courseId
        })

        if (!studentCourse) {
          return res.status(404).send({ message: 'Student is not enrolled in the course of the selected questionnaire' })
        }
        studentCourseId = studentCourse._id
      }

      let isCorrect = false
      let pointsObtained = 0

      if (question.type === 'CHOICE' && answer.selectedOptionId) {
        let selectedOption = question.options.id(answer.selectedOptionId)
        if (selectedOption && selectedOption.isCorrect) {
          isCorrect = true
          pointsObtained = question.points
        }
      } else if (question.type === 'OPEN' && answer.answerText) {
        if (answer.answerText.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()) {
          isCorrect = true
          pointsObtained = question.points
        }
      }

      let studentAnswer = new StudentAnswer(
        {
          ...answer,
          studentCourseId,
          isCorrect: isCorrect,
          pointsObtained: pointsObtained
        }
      )

      studentAnswers.push(studentAnswer)
    }

    await StudentAnswer.insertMany(studentAnswers)

    let result = await generateResult(studentCourseId, questionnaireId)

    return res.status(201).send(
      {
        message: 'All answers submitted successfully',
        answers: studentAnswers,
        result
      }
    )

  } catch (err) {
    console.error('Error submitting answers', err)
    return res.status(500).send(
      {
        message: 'Error submitting answers',
        error: err.message || err
      }
    )
  }
}
