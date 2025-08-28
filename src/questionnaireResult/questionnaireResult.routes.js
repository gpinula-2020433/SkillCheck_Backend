import { Router } from "express";
import { getAllResults,
         getResultById,
         addResult
} from "./questionnaireResult.controller.js";

const api = Router()

api.get('/allResults', getAllResults)
api.get('/resultsById', getResultById)
api.post('/addResult', addResult)

export default api