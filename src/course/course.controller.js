'use strict'

import Course from "./course.model.js"
import Competence from '../competences/competences.model.js'
import StudentCourse from "../studentCourse/studentCourse.model.js"

// Listar todos los cursos (filtrados por rol)

export const getAllCourses = async (req, res) => {
  try {
    const { limit = 10, skip = 0 } = req.query
    let courses

    if (req.user.role === "TEACHER") {
      courses = await Course.find({ teacher: req.user.uid })
        .skip(Number(skip))
        .limit(Number(limit))
        .populate("teacher", "name surname email")
        .populate("competences", "name description")

    } else if (req.user.role === "STUDENT") {
      const studentCourses = await StudentCourse.find({ student: req.user.uid }).select("course")
      const courseIds = studentCourses.map(sc => sc.course)

      courses = await Course.find({ _id: { $in: courseIds } })
        .skip(Number(skip))
        .limit(Number(limit))
        .populate("teacher", "name surname email")
        .populate("competences", "name description")

    } else {
      courses = await Course.find()
        .skip(Number(skip))
        .limit(Number(limit))
        .populate("teacher", "name surname email")
        .populate("competences", "name description")
    }

    if (!courses || courses.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No se encontraron cursos",
      })
    }

    return res.send({
      success: true,
      message: "Cursos encontrados",
      courses,
    })
  } catch (err) {
    console.error("General error", err)
    return res.status(500).send({
      success: false,
      message: "Error general",
      err,
    })
  }
}


// Listar curso por Id
export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params
        const course = await Course.findById(id)
            .populate('teacher', 'name surname email')
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


// Agregar Curso
export const addCourse = async (req, res) => {
  try {
    const { name, description, teacher, competences } = req.body

    if (!name || !teacher) {
      return res.status(400).json({
        success: false,
        message: "Name and teacher are required",
      })
    }

    let competencesIds = []
    if (competences) {
      const parsedCompetences = Array.isArray(competences)
        ? competences
        : JSON.parse(competences)

      for (const comp of parsedCompetences) {
        let competenceDoc = await Competence.findOne({ competenceName: comp });
        if (!competenceDoc) {
            competenceDoc = await Competence.create({
            competenceName: comp,
            number: 0,
            courseId: null
            })
        }
        competencesIds.push(competenceDoc._id)
        }
    }

    const courseData = {
      name,
      description,
      teacher,
      competences: competencesIds,
    }

    if (req.file) {
      courseData.imageCourse = req.file.filename
    }

    const course = await Course.create(courseData)

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    })
  } catch (error) {
    console.error(error)
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

        if (data.imageCourse) delete data.imageCourse  

        const update = await Course.findByIdAndUpdate(id, data, { new: true })
            .populate('teacher', 'name surname email')
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