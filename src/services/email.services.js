// src/services/email.services.js
import { createTransport } from "nodemailer";
import config from "../config/config.js";
import { purchaseTicketTemplate } from "../views/templates/purchaseTicketTemplate.js";
import { changePasswordTemplate } from "../views/templates/changePasswordTemplate.js";

export const transporter = createTransport({
  service: "gmail",
  secure: true,
  port: 587,
  auth: { user: config.mailUser, pass: config.mailPass },
});

// ⬇️ aceptar items y pasarlos al template
export const gmailConfig = (ticket, email, items = []) => ({
  from: config.mailUser,
  to: email,
  subject: "Purchase Ticket",
  html: purchaseTicketTemplate(ticket, email, items),
});

export const sendMailGmail = async (ticket, email, items = []) => {
  const mailOptions = gmailConfig(ticket, email, items);
  return transporter.sendMail(mailOptions);
};

// (lo de change password queda igual)
export const gmailChangePasswordConfig = (resetLink, email) => ({
  from: config.mailUser,
  to: email,
  subject: "Change Password",
  html: changePasswordTemplate(resetLink),
});