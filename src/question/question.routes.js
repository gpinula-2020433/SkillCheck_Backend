import { Router } from 'express';
import {
    getQuestionsForStudent
} from './question.controller.js';
import { validateJwt } from '../../middlewares/validate.jwt.js'
import {

} from '../../middlewares/validators.js'

const api = Router()

api.post('/', [validateJwt], )
api.get('/:id', [validateJwt], getQuestionsForStudent)

export default api