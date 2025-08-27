import { Router } from "express";
import { getAllCourses,
         getCourseById,
         addCourse,
         updateCourseById,
         deleteCourseById
 } from "./course.controller.js";

 const api = Router()

 api.get('/allCourses', getAllCourses)
 api.get('/courseById', getCourseById)
 api.post('/addCourse', addCourse)
 api.put('/updateCourse', updateCourseById)
 api.delete('/deleteCourse', deleteCourseById)

 export default api