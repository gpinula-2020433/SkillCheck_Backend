'use strict'

import StudentCourse from './studentCourse.model.js'

// Listar todos los cursos de estudiante
export const getAllStudentCourses = async (req, res) => {
    try {
        const { limit = 10, skip = 0 } = req.query

        const studentCourses = await StudentCourse.find()
            .skip(Number(skip))
            .limit(Number(limit))
            .populate('course', 'name description')
            //.populate('questionnaires', 'title description')

        if (studentCourses.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No se encontraron StudentCourses'
            })
        }

        return res.send({
            success: true,
            message: 'StudentCourses encontrados',
            studentCourses
        })

    } catch (err) {
        console.error('Error general', err)
        return res.status(500).send({
            success: false,
            message: 'Error general',
            err
        })
    }
}


// Listar los cursos de estudiante por Id
export const getStudentCourseById = async (req, res) => {
    try {
        const { id } = req.params
        const studentCourse = await StudentCourse.findById(id)
            .populate('course', 'name description')
            .populate('questionnaires', 'title description')

        if (!studentCourse) {
            return res.status(404).send({
                success: false,
                message: 'StudentCourse no encontrado'
            })
        }

        return res.send({
            success: true,
            message: 'StudentCourse encontrado',
            studentCourse
        })

    } catch (err) {
        console.error('Error general', err)
        return res.status(500).send({
            success: false,
            message: 'Error general',
            err
        })
    }
}


// Agregar un curso a estudiante
export const addStudentCourse = async (req, res) => {
    try {
        const data = req.body

        const studentCourse = new StudentCourse(data)
        await studentCourse.save()

        return res.send({
            success: true,
            message: 'StudentCourse agregado correctamente',
            studentCourse
        })
    } catch (err) {
        console.error('Error al agregar StudentCourse', err)
        return res.status(500).send({
            success: false,
            message: 'Error al agregar StudentCourse',
            err
        })
    }
}


// Eliminar un curso de estudiante
export const deleteStudentCourseById = async (req, res) => {
    try {
        const { id } = req.params

        const deletedStudentCourse = await StudentCourse.findByIdAndDelete(id)

        if (!deletedStudentCourse) {
            return res.status(404).send({
                success: false,
                message: 'StudentCourse no encontrado para eliminar'
            })
        }

        return res.send({
            success: true,
            message: 'StudentCourse eliminado correctamente',
            deletedStudentCourse
        })
    } catch (err) {
        console.error('Error al eliminar StudentCourse', err)
        return res.status(500).send({
            success: false,
            message: 'Error al eliminar StudentCourse',
            err
        })
    }
}