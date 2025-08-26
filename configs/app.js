
import express from "express"
import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"
import {limiter} from '../middlewares/rate.limit.js'
import cookieParser from "cookie-parser"
//import authRoutes from '../routes/auth.routes.js'

const configs = (app) =>{
    app.use(express.json())
    app.use(express.urlencoded({extended: false}))
    app.use(morgan('dev'))
    app.use(helmet())
    app.use(cookieParser())
    app.use(limiter)
    /* app.use(cors(
        {
            origin: 'http://localhost:5173',
            credentials: true
        }
    )) */
}

const routes = (app)=>{
    //app.use(authRoutes)
}

export const initServer = ()=>{
    const app = express()
    try {
        configs(app)
        routes(app)
        app.listen(process.env.PORT || 3200)
        console.log(`Server running on port: ${process.env.PORT || 3200}`)
    } catch (err) {
        console.error('The server failed to start', err)
    }
}