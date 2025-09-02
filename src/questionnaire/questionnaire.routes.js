import { Router } from 'express'
import { getAllQuestionnaires } from './questionnaire.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import {

} from '../../middlewares/validators.js'

const api = Router()

api.get('/', [validateJwt], getAllQuestionnaires)
api.post('/', [validateJwt], )

export default api;