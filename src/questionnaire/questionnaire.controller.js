import Questionnaire from './questionnaire.model.js'
import StudentCourse from '../studentCourse/studentCourse.model.js'
import Question from '../question/question.model.js'
import QuestionnaireResult from '../questionnaire.result/questionnaire.result.model.js'
import StudentAnswer from '../student.answer/student.answer.model.js'
import User from '../user/user.model.js'
import Course from '../course/course.model.js'

export const getAllQuestionnaires = async (req, res) => {
  let { limit = 10, skip = 0, courseId } = req.query

  limit = parseInt(limit)
  skip = parseInt(skip)

  const filter = {}

  if (courseId) {
    filter.courseId = courseId
    if(!await Course.findById(courseId)){
      return res.status(404).send(
        {
          message: 'El curso no existe'
        }
      )
    }
  }

  try {
    const questionnaires = await Questionnaire.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate('courseId', 'name')

    if (questionnaires.length === 0) {
      return res.status(404).send({
        message: 'Este curso no tiene cuestionarios registrados'
      })
    }

    return res.status(200).send({
      message: 'Cuestionarios obtenidos con éxito',
      total: questionnaires.length,
      data: questionnaires
    })
  } catch (err) {
    console.error('Error al obtener cuestionarios:', err)
    return res.status(500).send({
      success: false,
      message: 'Error interno del servidor',
      error: err.message || err
    })
  }
}

export const getQuestionnairesForStudent = async (req, res) => {
  const { uid } = req.user
  let { limit = 10, skip = 0, status, courseId } = req.query

  limit = parseInt(limit)
  skip = parseInt(skip)

  try {
    const studentCourses = await StudentCourse.find({ student: uid })
      .populate('course', 'name')

    if (studentCourses.length === 0) {
      return res.status(204).send({
        message: 'El estudiante no está inscrito en ningún curso',
      })
    }

    let courseIds = studentCourses.map(sc => sc.course._id)

    if (courseId) {
      courseIds = courseIds.filter(id => id.toString() === courseId)
      if (courseIds.length === 0) {
        return res.status(404).send({
          message: 'El estudiante no está inscrito en ese curso',
        })
      }
    }

    let questionnaires = await Questionnaire.find({ courseId: { $in: courseIds } })
      .populate('courseId', 'name')
      .sort({ createdAt: -1 })

    if (status === 'pending') {
      const studentCourseIds = studentCourses.map(sc => sc._id)

      const doneResults = await QuestionnaireResult.find({
        studentCourseId: { $in: studentCourseIds },
      }).select('questionnaireId')

      const doneIds = doneResults.map(r => r.questionnaireId.toString())

      questionnaires = questionnaires.filter(q => !doneIds.includes(q._id.toString()))
    }

    if (questionnaires.length === 0) {
      return res.status(200).send({
        message: status === 'pending' 
          ? 'No hay cuestionarios pendientes'
          : 'No se encontraron cuestionarios con los filtros aplicados',
        total: 0,
        data: []
      })
    }

    return res.status(200).send({
      message: 'Cuestionarios obtenidos con éxito',
      total: questionnaires.length,
      data: questionnaires,
    })
    
  } catch (err) {
    console.error('Error al obtener los cuestionarios:', err)
    return res.status(500).send({
      success: false,
      message: 'Error interno del servidor',
      error: err.message || err,
    })
  }
}



export const createQuestionnaireWithQuestions = async (req, res) => {
  try {
    let { questions, ...questionnaireData } = req.body

    if (questionnaireData.maxGrade && questionnaireData.maxAllowedGrade) {
      questionnaireData.weightOverMaxGrade = questionnaireData.maxGrade / questionnaireData.maxAllowedGrade
    }

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

export const getQuestionnaireWithQuestions = async (req, res) => {
  const questionnaireId = req.params.id
  
  try {
    
    const questionnaire = await Questionnaire.findById(questionnaireId)
      .populate('courseId', 'name')

    if (!questionnaire) {
      return res.status(404).send({
        message: 'El cuestionario no existe',
      })
    }

    const questions = await Question.find({ questionnaireId })
      .populate('competencyId', 'competenceName number')
      .sort({ createdAt: -1 })

    if (questions.length === 0) {
      return res.status(200).send({
        message: 'El cuestionario no tiene preguntas registradas',
        total: 0,
        data: {
          questionnaire,
          questions: [],
        },
      })
    }

    const formattedQuestions = questions.map(q => ({
      _id: q._id,
      statement: q.statement,
      type: q.type,
      competency: q.competencyId,
      points: q.points,
      options: q.type === 'CHOICE'
        ? q.options.map(opt => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
          }))
        : [],
      correctAnswer: q.type === 'OPEN' ? q.correctAnswer : null,
    }))

    return res.status(200).send({
      message: 'Cuestionario con preguntas y respuestas obtenido con éxito',
      total: formattedQuestions.length,
      data: {
        questionnaire,
        questions: formattedQuestions,
      },
    })

  } catch (err) {
    console.error('Error al obtener cuestionario con preguntas:', err)
    return res.status(500).send({
      success: false,
      message: 'Error interno del servidor',
      error: err.message || err,
    })
  }
}


export const getStudentAttemptReview = async (req, res) => {
  const { questionnaireId, studentCourseId } = req.body

  try {
    const studentCourse = await StudentCourse.findById(studentCourseId)
      .populate('student', 'name email')
      .populate('course', 'name')
    
    if (!studentCourse) {
      return res.status(404).send({
        message: 'El estudiante no está inscrito en este curso o el registro no existe'
      })
    }

    const questionnaire = await Questionnaire.findById(questionnaireId)
      .populate('courseId', 'name')

    if (!questionnaire) {
      return res.status(404).send({
        message: 'El cuestionario no existe',
      })
    }

    const questions = await Question.find({ questionnaireId })
      .populate('competencyId', 'competenceName number')
      .sort({ createdAt: -1 })

    const studentAnswers = await StudentAnswer.find({
      studentCourseId,
      questionnaireId
    })

    if (!studentAnswers || studentAnswers.length === 0) {
      return res.status(404).send({
        message: 'El estudiante no ha realizado este cuestionario todavía'
      })
    }

    const answersMap = {}
    studentAnswers.forEach(a => {
      answersMap[a.questionId.toString()] = a
    })

    const review = questions.map(q => {
      const studentAnswer = answersMap[q._id.toString()] || null

      return {
        _id: q._id,
        statement: q.statement,
        type: q.type,
        competency: q.competencyId,
        points: q.points,
        options: q.type === 'CHOICE'
          ? q.options.map(opt => ({
              _id: opt._id,
              text: opt.text,
              isCorrect: opt.isCorrect,
              isSelected: studentAnswer
                ? studentAnswer.selectedOptionId?.toString() === opt._id.toString()
                : false,
              answered: !!studentAnswer
            }))
          : [],
        correctAnswer: q.type === 'OPEN' ? q.correctAnswer : null,
        studentAnswer: q.type === 'OPEN'
          ? studentAnswer?.answerText || ''
          : null,
        isCorrect: studentAnswer ? studentAnswer.isCorrect : false,
        pointsObtained: studentAnswer ? studentAnswer.pointsObtained : 0,
        answered: !!studentAnswer
      }
    })

    return res.status(200).send({
      message: 'Revisión del intento obtenida con éxito',
      total: review.length,
      data: {
        student: studentCourse.student,
        course: studentCourse.course,
        questionnaire,
        questions: review
      }
    })

  } catch (err) {
    console.error('Error al obtener revisión del intento:', err)
    return res.status(500).send({
      success: false,
      message: 'Error interno del servidor',
      error: err.message || err,
    })
  }
}

export const getQuestionnaireResults = async (req, res) => {
  const { questionnaireId } = req.body

  try {
    const questionnaire = await Questionnaire.findById(questionnaireId)
      .populate('courseId', 'name')

    if (!questionnaire) {
      return res.status(404).send({
        message: 'El cuestionario no existe'
      })
    }

    const studentCourses = await StudentCourse.find({ course: questionnaire.courseId._id })
      .populate('student', 'name surname email')
      .populate('course', 'name')

    if (!studentCourses || studentCourses.length === 0) {
      return res.status(204).send({
        message: 'No hay estudiantes inscritos en esta materia'
      })
    }

    const results = await Promise.all(
      studentCourses.map(async (sc) => {
        const result = await QuestionnaireResult.findOne({
          studentCourseId: sc._id,
          questionnaireId
        })

        return {
          studentCourseId: sc._id,
          student: `${sc.student.name} ${sc.student.surname}`,
          email: sc.student.email,
          course: sc.course.name,
          result: result || null
        }
      })
    )

    return res.status(200).send({
      message: 'Resultados del cuestionario obtenidos con éxito',
      total: results.length,
      questionnaire: {
        _id: questionnaire._id,
        title: questionnaire.title,
        course: questionnaire.courseId.name
      },
      data: results
    })

  } catch (err) {
    console.error('Error al obtener resultados del cuestionario:', err)
    return res.status(500).send({
      success: false,
      message: 'Error interno del servidor',
      error: err.message || err
    })
  }
}

export const getStudentAttemptForQuestionnaire = async (req, res) => {
  try {
    const { uid } = req.user
    const { id: questionnaireId } = req.params

    const questionnaire = await Questionnaire.findById(questionnaireId).select("courseId")
    if (!questionnaire) {
      return res.status(404).send({ message: "Cuestionario no encontrado" })
    }

    const studentCourse = await StudentCourse.findOne({
      student: uid,
      course: questionnaire.courseId
    })

    if (!studentCourse) {
      return res.status(403).send({
        message: "El estudiante no está inscrito en el curso de este cuestionario"
      })
    }

    const attempt = await QuestionnaireResult.findOne({
      studentCourseId: studentCourse._id,
      questionnaireId
    })
      .populate("questionnaireId", "title description maxGrade passingGrade maxAllowedGrade weightOverMaxGrade")
      .populate({
        path: "studentCourseId",
        populate: { path: "course", select: "name" }
      })
      .lean()

    if (!attempt) {
      return res.status(404).send({
        message: "El estudiante no tiene intento en este cuestionario"
      })
    }

    return res.status(200).send({
      message: "Resultado encontrado",
      attempt
    })
  } catch (err) {
    console.error("Error al verificar intento del cuestionario:", err)
    return res.status(500).send({
      message: "Error interno del servidor",
      error: err.message || err
    })
  }
}
