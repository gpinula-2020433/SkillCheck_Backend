'use strict'

import QuestionnaireResult from './questionnaireResult.model.js'

// Listar todos los resultados
export const getAllResults = async (req, res) => {
    try {
        const { limit = 10, skip = 0 } = req.query

        const results = await QuestionnaireResult.find()
            .skip(Number(skip))
            .limit(Number(limit))
            .populate('user', 'name surname username email')
            .populate('competeceName', 'name description')

        if (results.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No se encontraron resultados'
            })
        }

        return res.send({
            success: true,
            message: 'Resultados encontrados',
            results
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

// Listar resultado por Id
export const getResultById = async (req, res) => {
    try {
        const { id } = req.params
        const result = await QuestionnaireResult.findById(id)
            .populate('user', 'name surname username email')
            .populate('competeceName', 'name description')

        if (!result) {
            return res.status(404).send({
                success: false,
                message: 'Resultado no encontrado'
            })
        }

        return res.send({
            success: true,
            message: 'Resultado encontrado',
            result
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

// Crear resultado y calcular porcentaje automáticamente
export const addResult = async (req, res) => {
    try {
        const { user, competeceName, totalQuestions, correctAnswers, wrongAnswers } = req.body

        if (!user || !competeceName || !totalQuestions) {
            return res.status(400).send({
                success: false,
                message: 'Faltan datos obligatorios'
            })
        }

        const percentage = ((correctAnswers / totalQuestions) * 100).toFixed(2)

        const newResult = new QuestionnaireResult({
            user,
            competeceName,
            totalQuestions,
            correctAnswers,
            wrongAnswers,
            percentage
        })

        await newResult.save()

        return res.status(201).send({
            success: true,
            message: 'Resultado creado exitosamente',
            result: newResult
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