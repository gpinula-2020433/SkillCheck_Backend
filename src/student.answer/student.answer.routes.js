import { Router } from 'express';
import {

} from './student.answer.controller.js';
import { validateJwt } from '../../middlewares/validate.jwt.js'
import {

} from '../../middlewares/validators.js'


const api = Router()

api.get('/', [validateJwt], )
api.post('/', [validateJwt], )

export default api;