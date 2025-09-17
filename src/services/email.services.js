// src/services/email.services.js
import { createTransport } from "nodemailer";
import config from "../config/config.js";
import { purchaseTicketTemplate } from "../views/templates/purchaseTicketTemplate.js";
import { changePasswordTemplate } from "../views/templates/changePasswordTemplate.js";

// Transporter único
export const transporter = createTransport({
  service: "gmail",
  secure: true,
  port: 587,
  auth: {
    user: config.mailUser, // ej: process.env.GMAIL
    pass: config.mailPass, // ej: process.env.PASS_GOOGLE
  },
});

// ---- Emails de compra (ya usados en cart.services.js)
export const gmailConfig = (ticket, email) => ({
  from: config.mailUser,
  to: email,
  subject: "Purchase Ticket",
  html: purchaseTicketTemplate(ticket, email),
});

// Helper que algunos módulos importan (no lo elimines)
export const sendMailGmail = async (ticket, email) => {
  const mailOptions = gmailConfig(ticket, email);
  return transporter.sendMail(mailOptions);
};

// ---- Email para reset de contraseña
export const gmailChangePasswordConfig = (resetLink, email) => ({
  from: config.mailUser,
  to: email,
  subject: "Change Password",
  html: changePasswordTemplate(resetLink),
});