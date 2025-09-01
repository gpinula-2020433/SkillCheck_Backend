import { Router } from "express";
import { addCompetence, deleteCompetenceById, getAllCompetences,
         getCompetenceById
 } from "./competences.controller.js";

 const api = Router()

api.get('/allCompetences', getAllCompetences)
api.get('/competenceById/:id', getCompetenceById)
api.post('/addCompetence', addCompetence)
api.delete('/deleteCompetence/:id', deleteCompetenceById)

 export default api