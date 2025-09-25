
import express from "express"
import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"
import path from 'path'
import {limiter} from '../middlewares/rate.limit.js'
import cookieParser from "cookie-parser"
import { defaultAdmin } from "../src/user/user.controller.js"
import courseRoutes from '../src/course/course.routes.js'
import studentCourseRoutes from '../src/studentCourse/studentCourse.routes.js'
import competencesRoutes from '../src/competences/competences.routes.js'
import authRoutes from '../src/auth/auth.routes.js'
import questionnaireRoutes from "../src/questionnaire/questionnaire.routes.js"
import questionRoutes from "../src/question/question.routes.js"
import questionnaireResultRoutes from "../src/questionnaire.result/questionnaire.result.routes.js"
import studentAnswerRoutes from "../src/student.answer/student.answer.routes.js"
import userRoutes from '../src/user/user.routes.js'
import { deleteFileOnError } from "../middlewares/delete.file.on.errors.js"

const configs = (app) =>{
    app.use(cors(
        {
            origin: process.env.CLIENT_URL,
            credentials: true
        }
    ))
    app.use(limiter)
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    app.use(morgan('dev'))
    app.use(helmet())
    app.use(cookieParser())
    app.use('/uploads/img/courses', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL)
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
    next()
    }, express.static(path.join(process.cwd(), 'uploads/img/courses')))
}

const routes = (app)=>{
    app.use(authRoutes)
    app.use('/v1/user', userRoutes)
    app.use('/v1/course', courseRoutes)
    app.use('/v1/studentCourse', studentCourseRoutes)
    app.use('/v1/questionnaireResult', questionnaireResultRoutes)
    app.use('/v1/competences', competencesRoutes)
    app.use('/v1/questionnaire', questionnaireRoutes)
    app.use('/v1/question', questionRoutes)
    app.use('/v1/studentAnswer', studentAnswerRoutes)
    app.use(deleteFileOnError)
}

export const initServer = ()=>{
    const app = express()
    try {
        configs(app)
        routes(app)
        app.listen(process.env.PORT || 3200)
        console.log(`Server running on port: ${process.env.PORT || 3200}`)
        defaultAdmin()
    } catch (err) {
        console.error('The server failed to start', err)
    }
}