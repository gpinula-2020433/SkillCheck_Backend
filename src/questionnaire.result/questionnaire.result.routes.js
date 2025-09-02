
import {
    generateResult
} from './questionnaire.result.controller.js';
import { validateJwt } from '../../middlewares/validate.jwt.js'
import {
    
} from '../../middlewares/validators.js'
import { Router } from 'express';

const api = Router()

api.post('/', [validateJwt], generateResult)
api.post('/', [validateJwt], )

export default api;