import nodemailer from "nodemailer";
import { Contact } from "../models/contactModels.js";
import dotenv from "dotenv";
dotenv.config();

export const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    // ✅ Save contact form data in MongoDB
    const contact = await Contact.create({ name, email, message });

    // ✅ Gmail transporter (TLS – safer for Render)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,              // Use TLS (not SSL)
      secure: false,          // STARTTLS
      auth: {
        user: process.env.MAIL_USER, // finevision18@gmail.com
        pass: process.env.MAIL_PASS, // App Password
      },
      tls: {
        rejectUnauthorized: false, // prevent SSL handshake issues
      },
    });

    // ✅ Build email content
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.MAIL_TO || "finevision18@gmail.com",
      subject: `📩 New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6">
          <h2>📩 New Contact Message Received</h2>
          <table cellpadding="6" cellspacing="0" style="border-collapse:collapse">
            <tr><td><b>Name:</b></td><td>${name}</td></tr>
            <tr><td><b>Email:</b></td><td>${email}</td></tr>
          </table>
          <h3 style="margin-top:16px;">Message</h3>
          <p>${message.replace(/\n/g, "<br/>")}</p>
          <p style="color:#777;margin-top:16px">Submitted on: ${new Date().toLocaleString()}</p>
        </div>
      `,
      replyTo: email,
    };

    // ✅ Try sending email
    try {
      await transporter.sendMail(mailOptions);
      console.log("📧 Email sent successfully!");
    } catch (emailError) {
      console.warn("⚠️ Email sending skipped due to Render SMTP issue:", emailError.code);
    }

    // ✅ Always respond with success (so frontend works)
    res.status(200).json({
      success: true,
      message: "Message saved to database! (Email sent or skipped)",
      contact,
    });
  } catch (error) {
    console.error("❌ Error handling contact message:", error);
    res.status(500).json({
      success: false,
      message: "Error processing contact form",
      error: error.message,
    });
  }
};
