'use strict'

import Competence from './competences.model.js'

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