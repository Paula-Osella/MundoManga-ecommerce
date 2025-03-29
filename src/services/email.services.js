import { createTransport } from "nodemailer";
import { purchaseTicketTemplate } from '../views/templates/purchaseTicketTemplate.js';
import { changePasswordTemplate } from '../views/templates/changePasswordTemplate.js';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken'; 
import config from "../config/config.js";


export const transporter = createTransport({
    service: 'gmail',
    secure: true,
    port: 587,
    auth: {
        user: config.mailUser,
        pass: config.mailPass
    }
});


export const gmailConfig = (ticket, email) => ({
    from: config.mailUser,
    to: email,
    subject: 'Purchase Ticket',
    html: purchaseTicketTemplate(ticket, email),
});


export const sendMailGmail = async (ticket, email) => {
    try {
        const mailOptions = gmailConfig(ticket, email);
        const response = await transporter.sendMail(mailOptions);

        if (response.accepted.length > 0) {
            console.log('✅ Email enviado con éxito a:', email);
        } else {
            console.log('⚠️ El correo no fue aceptado.');
        }
    } catch (error) {
        console.error('❌ Error enviando el correo:', error);
        throw error;
    }
};

export const gmailChangePasswordConfig = (resetLink, email) => {
    return ({
        from: process.env.EMAIL_USER,  
        to: email,   
        subject: 'Change Password',  
        html: changePasswordTemplate(resetLink),  
    });
};

