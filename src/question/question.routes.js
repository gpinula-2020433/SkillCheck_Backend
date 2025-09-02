import { Router } from 'express';
import {
    createQuestionnaireWithQuestions,
    getQuestionsForStudent
} from './question.controller.js';
import { validateJwt } from '../../middlewares/validate.jwt.js'
import {

} from '../../middlewares/validators.js'

const api = Router()

api.post('/', [validateJwt], createQuestionnaireWithQuestions)
api.get('/:id', [validateJwt], getQuestionsForStudent)

export default api