'use strict'

import Course from "./course.model.js"

// Listar todos los cursos
export const getAllCourses = async (req, res) => {
    try {
        const { limit = 10, skip = 0 } = req.query

        const courses = await Course.find()
            .skip(Number(skip))
            .limit(Number(limit))
            .populate('user', 'name surname username email')
            .populate('questionnaries', 'tittle description')
            .populate('competences', 'name description')

        if (courses.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No se encontraron cursos'
            })
        }

        return res.send({
            success: true,
            message: 'Cursos encontrados',
            courses
        })

    } catch (err) {
        console.error('General error', err)
        return res.status(500).send({
            success: false,
            message: 'Error general',
            err
        })
    }
}


// Listar curso por Id
export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params
        const course = await Course.findById(id)
            .populate('user', 'name surname username email')
            .populate('questionnaries', 'tittle description')
            .populate('competences', 'name description')

        if (!course) {
            return res.status(404).send({
                success: false,
                message: 'Curso no encontrado'
            })
        }

        return res.send({
            success: true,
            message: 'Curso encontrado',
            course
        })

    } catch (err) {
        console.error('General error', err)
        return res.status(500).send({
            success: false,
            message: 'Error general',
            err
        })
    }
}


//Agregar Curso
export const addCourse = async (req, res) => {
  try {
    const { name, description, teacher, questionnaires, competences } = req.body;

    if (!name || !description || !teacher) {
      return res.status(400).json({
        success: false,
        message: "Name, description and teacher are required",
      })
    }

    const courseData = {
      name,
      description,
      teacher,
      questionnaires,
      competences,
    }

    if (req.file) {
      courseData.imageCourse = [req.file.filename]
    }

    const course = await Course.create(courseData)

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating course",
      error: error.message,
    })
  }
}


// Actualizar curso 
export const updateCourseById = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body       

        if (data.image) delete data.image  

        const update = await Course.findByIdAndUpdate(id, data, { new: true })
            .populate('user', 'name surname username email')
            .populate('questionnaries', 'tittle description')
            .populate('competences', 'name description')

        if (!update) {
            return res.status(404).send({
                success: false,
                message: 'Curso no encontrado'
            })
        }

        return res.send({
            success: true,
            message: 'Curso actualizado correctamente',
            course: update
        })

    } catch (err) {
        console.error('General error', err)
        return res.status(500).send({
            success: false,
            message: 'Error general',
            err
        })
    }
}


// Eliminar Curso
export const deleteCourseById = async (req, res) => {
    try {
        const { id } = req.params
        const course = await Course.findById(id)

        if (!course) {
            return res.status(404).send({
                success: false,
                message: 'No se encontró el curso'
            })
        }

        await Course.findByIdAndDelete(id)

        return res.send({
            success: true,
            message: 'Curso eliminado correctamente'
        })
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send({
            success: false,
            message: 'Error general',
            err
        })
    }
}