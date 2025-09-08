import { Router } from 'express';
import { submitAnswers } from './student.answer.controller.js';
import { validateJwt } from '../../middlewares/validate.jwt.js'
import {

} from '../../middlewares/validators.js'
import { checkAnswersAndAttempt } from '../../utils/db.validators.js';


const api = Router()

api.get('/', [validateJwt], )
api.post('/submitAnswers', [validateJwt, checkAnswersAndAttempt], submitAnswers)

export default api;