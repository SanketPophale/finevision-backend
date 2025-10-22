import express from "express";
import { addPatient, getPatients } from "../controllers/patientControllers.js"


const router = express.Router();

// Route to add new patient
router.post("/add", addPatient);

// Route to get all patients
router.get("/", getPatients);

export default router;
