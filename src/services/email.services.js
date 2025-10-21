// src/services/email.services.js
import { Resend } from 'resend';
import config from '../config/config.js';
import { purchaseTicketTemplate } from '../views/templates/purchaseTicketTemplate.js';
import { changePasswordTemplate } from '../views/templates/changePasswordTemplate.js';

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Transporter “compat” para no tocar tus controladores
export const transporter = {
  /**
   * Emula nodemailer.sendMail usando Resend
   * @param {{ from:string, to:string|string[], subject:string, html:string }} mail
   */
  async sendMail(mail) {
    const toList = Array.isArray(mail.to) ? mail.to : [mail.to];

    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL  ||  mail.from  ||  config.mailUser,
      to: toList,
      subject: mail.subject,
      html: mail.html,
      replyTo: process.env.REPLY_TO || undefined
    });

    if (error) {
      // Imitamos el comportamiento de nodemailer para que tus logs sigan teniendo sentido
      const err = new Error(error.message || 'Resend send error');
      err.code = error.name || 'RESEND_ERROR';
      throw err;
    }

    // Respuesta “similar” a nodemailer
    return {
      accepted: toList,
      messageId: data?.id || 'resend-message',
      response: 'OK via Resend'
    };
  }
};

// ⬇️ Config del mail de compra (se mantiene igual, solo “from” usa tu config/env)
export const gmailConfig = (ticket, email, items = []) => ({
  from: process.env.FROM_EMAIL || config.mailUser,
  to: email,
  subject: 'Purchase Ticket',
  html: purchaseTicketTemplate(ticket, email, items)
});

// Helper que usan tus controladores (se mantiene)
export const sendMailGmail = async (ticket, email, items = []) => {
  const mailOptions = gmailConfig(ticket, email, items);
  return transporter.sendMail(mailOptions);
};

// ⬇️ Mail de cambio de contraseña (igual lógica)
export const gmailChangePasswordConfig = (resetLink, email) => ({
  from: process.env.FROM_EMAIL || config.mailUser,
  to: email,
  subject: 'Change Password',
  html: changePasswordTemplate(resetLink)
});
