'use strict'

import Competence from './competences.model.js'
import Course from '../course/course.model.js'
import mongoose from 'mongoose'

// Listar todas las competencias
export const getAllCompetences = async (req, res) => {
    try {
        const { limit = 10, skip = 0 } = req.query

        const competences = await Competence.find()
            .skip(Number(skip))
            .limit(Number(limit))

        if (competences.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No se encontraron competencias'
            })
        }

        return res.send({
            success: true,
            message: 'Competencias encontradas',
            competences
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


// Listar competencia por Id
export const getCompetenceById = async (req, res) => {
    try {
        const { id } = req.params
        const competence = await Competence.findById(id)

        if (!competence) {
            return res.status(404).send({
                success: false,
                message: 'Competencia no encontrada'
            })
        }

        return res.send({
            success: true,
            message: 'Competencia encontrada',
            competence
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


// Listar competencias por curso
export const getCompetencesByCourse = async (req, res) => {
  try {
    const { id } = req.params

    // Buscar el curso y popular el arreglo de competencias
    const course = await Course.findById(id).populate('competences')

    if (!course || !course.competences || course.competences.length === 0) {
      return res.status(404).send({
        success: false,
        message: 'No se encontraron competencias para este curso'
      })
    }

    return res.send({
      success: true,
      message: 'Competencias encontradas',
      competences: course.competences
    })
  } catch (err) {
    console.error('Error al listar competencias por curso', err)
    return res.status(500).send({
      success: false,
      message: 'Error al listar competencias por curso',
      err: err.message || err
    })
  }
}



// Agregar una competencia
export const addCompetence = async (req, res) => {
    try {
        const data = req.body

        const competence = new Competence(data)
        await competence.save()

        return res.send({
            success: true,
            message: 'Competencia agregada correctamente',
            competence
        })
    } catch (err) {
        console.error('Error al agregar competencia', err)
        return res.status(500).send({
            success: false,
            message: 'Error al agregar competencia',
            err
        })
    }
}


// Eliminar una competencia por Id
export const deleteCompetenceById = async (req, res) => {
    try {
        const { id } = req.params

        const deletedCompetence = await Competence.findByIdAndDelete(id)

        if (!deletedCompetence) {
            return res.status(404).send({
                success: false,
                message: 'Competencia no encontrada para eliminar'
            })
        }

        return res.send({
            success: true,
            message: 'Competencia eliminada correctamente',
            deletedCompetence
        })
    } catch (err) {
        console.error('Error al eliminar competencia', err)
        return res.status(500).send({
            success: false,
            message: 'Error al eliminar competencia',
            err
        })
    }
}