import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String },
    age: { type: Number },
    gender: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    service: { type: String },
    address: { type: String },
    symptoms: { type: String }, // Primary symptoms / reason for visit
    history: { type: String },  // Relevant history / previous prescriptions
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

export const Patient = mongoose.model("Patient", patientSchema);
