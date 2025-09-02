
import express from "express"
import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"
import {limiter} from '../middlewares/rate.limit.js'
import cookieParser from "cookie-parser"
import { defaultAdmin } from "../src/user/user.controller.js"
import courseRoutes from '../src/course/course.routes.js'
import studentCourseRoutes from '../src/studentCourse/studentCourse.routes.js'
import questionnaireResultRoutes from "../src/questionnaireResult/questionnaireResult.routes.js"
import competencesRoutes from '../src/competences/competences.routes.js'
import authRoutes from '../src/auth/auth.routes.js'
import questionnaireRoutes from "../src/questionnaire/questionnaire.routes.js"
import questionRoutes from "../src/question/question.routes.js"
import questionnaireResultRoutes from "../src/questionnaire.result/questionnaire.result.routes.js"

const configs = (app) =>{
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    app.use(morgan('dev'))
    app.use(helmet())
    app.use(cookieParser())
    app.use(limiter)
    app.use(cors(
        {
            origin: process.env.CLIENT_URL,
            credentials: true
        }
    ))
}

const routes = (app)=>{
    app.use(authRoutes)
    app.use('/v1/course', courseRoutes)
    app.use('/v1/studentCourse', studentCourseRoutes)
    app.use('/v1/questionnaireResult', questionnaireResultRoutes)
    app.use('/v1/competences', competencesRoutes)
    app.use('/questionnaire', questionnaireRoutes)
    app.use('/question', questionRoutes)
    app.use('/result', questionnaireResultRoutes)
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