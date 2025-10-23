import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";     // ✅ correct relative path
import authRoutes from "./src/routes/authRoutes.js";
import patientRoutes from "./src/routes/patientRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";

dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Middleware
app.use(cors({ origin: "*" })); // or specify your frontend origin for better security
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/contact", contactRoutes);

// ✅ Root route (for testing)
app.get("/", (req, res) => {
  res.status(200).send("🚀 FineVision Backend API is Running Successfully!");
});

// ✅ 404 route handler (safety)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global error handler (optional, useful for debugging)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ FineVision server running on port ${PORT}`);
});
