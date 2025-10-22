import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const mailer = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER?.trim(),
    pass: process.env.MAIL_PASS?.trim(),
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const verifyMailer = async () => {
  try {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
      console.error("❌ Missing MAIL_USER or MAIL_PASS in .env");
      return;
    }

    await mailer.verify();
    console.log("📧 Mailer ready (Gmail SMTP connected successfully).");
  } catch (err) {
    console.error("❌ Mailer connection error:", err.message);
  }
};
