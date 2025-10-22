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

    // ✅ Configure Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER, // finevision18@gmail.com
        pass: process.env.MAIL_PASS, // 16-character app password
      },
    });

    // ✅ Build email content
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.MAIL_TO || "finevision18@gmail.com", // receiver email
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
      replyTo: email, // lets you reply directly to the user's email
    };

    // ✅ Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Message sent successfully and saved to database!",
      contact,
    });
  } catch (error) {
    console.error("❌ Error sending contact message:", error);
    res
      .status(500)
      .json({ success: false, message: "Error sending message", error });
  }
};
