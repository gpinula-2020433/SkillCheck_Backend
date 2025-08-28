import { Router } from "express";
import { getAllCompetences,
         getCompetenceById
 } from "./competences.controller.js";

 const api = Router()

api.get('/allCompetences', getAllCompetences)
api.get('/competenceById', getCompetenceById)

 export default api