import { Router } from 'express'
import { createQuestionnaireWithQuestions, getAllQuestionnaires, getQuestionnaireResults, getQuestionnairesForStudent, getQuestionnaireWithQuestions, getStudentAttemptReview } from './questionnaire.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import {

} from '../../middlewares/validators.js'
import { validateCreateQuestionnaireWithQuestions } from '../../utils/db.validators.js'

const api = Router()

api.get('/getAllQuestionnaires', [validateJwt], getAllQuestionnaires) //Admin
api.get('/getQuestionnairesForStudent', [validateJwt], getQuestionnairesForStudent) //Student
api.post('/createQuestionnaireWithQuestions', [ //Admin or Teacher
        validateJwt, validateCreateQuestionnaireWithQuestions
    ], 
    createQuestionnaireWithQuestions
)
api.get('/getQuestionnaireWithQuestions/:id', [validateJwt], getQuestionnaireWithQuestions) //Admin or teacher
api.get('/getStudentAttemptReview', [validateJwt],getStudentAttemptReview) //Admin, teacher or student
api.get('/getQuestionnaireResults', [validateJwt],getQuestionnaireResults) //Admin

export default api;