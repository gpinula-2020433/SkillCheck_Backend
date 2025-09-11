import { Router } from 'express'
import { createQuestionnaireWithQuestions, getAllQuestionnaires, getQuestionnaireResults, getQuestionnairesForStudent, getQuestionnaireWithQuestions, getStudentAttemptForQuestionnaire, getStudentAttemptReview, getStudentCourses, getStudentQuestionnaireResults } from './questionnaire.controller.js'
import { validateJwt } from '../../middlewares/validate.jwt.js'
import {

} from '../../middlewares/validators.js'
import { validateCreateQuestionnaireWithQuestions } from '../../utils/db.validators.js'

const api = Router()

//Obtiene todos los cuestionarios/ se puede filtrar por materia
api.get('/getAllQuestionnaires', [validateJwt], getAllQuestionnaires) //Admin

//Obtiene los cuestionarios del usuario autenticado, todos donde él esté inscrito
//Se puede filtrar por pendientes, materia o ambos
api.get('/getQuestionnairesForStudent', [validateJwt], getQuestionnairesForStudent) //Student

//Crear cuestionario
api.post('/createQuestionnaireWithQuestions', [ //Admin o Teacher
        validateJwt, validateCreateQuestionnaireWithQuestions
    ], 
    createQuestionnaireWithQuestions
)

//Obtiene cuestionario con preguntas
api.get('/getQuestionnaireWithQuestions/:id', [validateJwt], getQuestionnaireWithQuestions) //Admin o teacher

//Revisión del intento
api.get('/getStudentAttemptReview', [validateJwt],getStudentAttemptReview) //Admin, teacher o student

//Obtiene un resumen de los intentos del cuestionario, de todos los usuarios que pertenezcan a esa materia
api.post('/getQuestionnaireResults', [validateJwt],getQuestionnaireResults) //Admin

//Ver si el usuario tiene un intento en el cuestionario 
api.get('/getStudentAttemptForQuestionnaire/:id', [validateJwt], getStudentAttemptForQuestionnaire)

//Ver los resultados de los cuestionarios de una materia
api.get('/getStudentQuestionnaireResults', [validateJwt], getStudentQuestionnaireResults)

//Listar materias en las que estoy inscrito
api.get('/getStudentCourses', [validateJwt], getStudentCourses)

export default api;
