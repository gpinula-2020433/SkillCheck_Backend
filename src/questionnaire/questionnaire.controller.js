import Questionnaire from './questionnaire.model.js'

export const getAllQuestionnaires = async (req, res) => {
  let { limit = 10, skip = 0 } = req.query

  limit = parseInt(limit)
  skip = parseInt(skip)

  try {
    const questionnaires = await Questionnaire.find()
      .skip(skip)
      .limit(limit)
      //.populate('courseId', 'name')
      .sort({ createdAt: -1 })

    if (questionnaires.length === 0) {
      return res.status(204).send(
        {
          message: 'No se encontraron cuestionarios'
        }
      )
    }

    return res.status(200).send(
      {
        message: 'Cuestionarios obtenidos con éxito',
        total: questionnaires.length,
        data: questionnaires
      }
    )
  } catch (err) {
    console.error('Error al obtener cuestionarios:', err)
    return res.status(500).send(
      {
        success: false,
        message: 'Error interno del servidor',
        error: err.message || err
      }
    )
  }
}
