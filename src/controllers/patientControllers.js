// src/controllers/patientController.js
import { Patient } from "../models/patientModels.js";
import { mailer } from "../utils/mailer.js";

const toSafe = (v) => (v ?? "").toString().trim();

export const addPatient = async (req, res) => {
  try {
    // Extract expected fields (ensure consistent naming with frontend)
    const {
      firstName,
      lastName,
      age,
      gender,
      phone,
      email,
      service,
      address,
      symptoms,
      history,
    } = req.body || {};

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (firstName, lastName, email, phone).",
      });
    }

    // Save to MongoDB
    const patient = await Patient.create({
      firstName: toSafe(firstName),
      lastName: toSafe(lastName),
      age: toSafe(age),
      gender: toSafe(gender),
      phone: toSafe(phone),
      email: toSafe(email),
      service: toSafe(service),
      address: toSafe(address),
      symptoms: toSafe(symptoms),
      history: toSafe(history),
    });

    // ---------------- Email Content ---------------- //
    const subject = `🩺 New Patient Registration: ${patient.firstName} ${patient.lastName}`;

    const plainText = `
A new patient has submitted the registration form:

Name: ${patient.firstName} ${patient.lastName}
Age: ${patient.age || "-"}
Gender: ${patient.gender || "-"}
Phone: ${patient.phone || "-"}
Email: ${patient.email || "-"}
Service Requested: ${patient.service || "-"}
Address: ${patient.address || "-"}

Primary Symptoms / Reason for Visit:
${patient.symptoms || "-"}

Relevant History / Previous Prescriptions:
${patient.history || "-"}
Submitted at: ${new Date().toLocaleString()}
    `.trim();

    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6;">
        <h2 style="color:#0056b3;">🩺 New Patient Registration Received</h2>
        <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
          <tr><td><b>First Name</b></td><td>${patient.firstName}</td></tr>
          <tr><td><b>Last Name</b></td><td>${patient.lastName}</td></tr>
          <tr><td><b>Age</b></td><td>${patient.age || "-"}</td></tr>
          <tr><td><b>Gender</b></td><td>${patient.gender || "-"}</td></tr>
          <tr><td><b>Phone</b></td><td>${patient.phone || "-"}</td></tr>
          <tr><td><b>Email</b></td><td>${patient.email || "-"}</td></tr>
          <tr><td><b>Service Requested</b></td><td>${patient.service || "-"}</td></tr>
          <tr><td><b>Address</b></td><td>${patient.address || "-"}</td></tr>
        </table>

        <h3 style="margin-top:16px;">Primary Symptoms / Reason for Visit</h3>
        <p>${patient.symptoms || "-"}</p>

        <h3 style="margin-top:16px;">Relevant History / Previous Prescriptions</h3>
        <p>${patient.history || "-"}</p>

        <p style="color:#777;margin-top:20px;">Submitted at: ${new Date().toLocaleString()}</p>
      </div>
    `;

    // ---------------- Send Email ---------------- //
    await mailer.sendMail({
      from: `"FineVision Website" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO || "finevision18@gmail.com",
      subject,
      text: plainText,
      html,
      replyTo: patient.email,
    });

    // ---------------- Success Response ---------------- //
    return res.status(201).json({
      success: true,
      message: "✅ Patient registered and email sent successfully!",
      patient,
    });

  } catch (error) {
    console.error("❌ Error saving patient form or sending email:", error);
    return res.status(500).json({
      success: false,
      message: "❌ Error saving patient form or sending email.",
      error: error.message || error,
    });
  }
};

// ---------------- Get all patients (optional) ---------------- //
export const getPatients = async (req, res) => {
  try {
    const data = await Patient.find().sort({ createdAt: -1 });
    return res.json({ success: true, data });
  } catch (error) {
    console.error("❌ Error fetching patients:", error);
    return res.status(500).json({ message: "Failed to fetch patients", error });
  }
};
