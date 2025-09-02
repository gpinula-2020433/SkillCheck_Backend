import StudentAnswer from './student.answer.model.js'
import Question from '../question/question.model.js'

export const submitAnswers = async (req, res) => {
  try {
    let data = req.body.answers 

    let studentAnswers = []

    for (let answer of data) {
      let question = await Question.findById(answer.questionId)
      if (!question) {
        return res.status(404).send({ message: 'Question not found' })
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
          isCorrect: isCorrect,
          pointsObtained: pointsObtained
        }
      )

      studentAnswers.push(studentAnswer)
    }

    await StudentAnswer.insertMany(studentAnswers)

    return res.status(201).send(
      {
        message: 'All answers submitted successfully',
        answers: studentAnswers
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
