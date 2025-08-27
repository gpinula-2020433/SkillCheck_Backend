import { Router } from "express";
import { getAllStudentCourses,
         getStudentCourseById,
 } from "./studentCourse.controller.js";

 const api = Router()

 api.get('/allCoursesStudent', getAllStudentCourses)
 api.get('/courseStudentById', getStudentCourseById)

 export default api