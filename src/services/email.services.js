import { createTransport } from "nodemailer";
import { purchaseTicketTemplate } from '../views/templates/purchaseTicketTemplate.js';
import config from "../config/config.js"; 

// Se crea el objeto de transporte con las credenciales de Gmail
export const transporter = createTransport({
    service: 'gmail',
    secure: true,
    port: 587, 
    auth: {
        user: config.mailUser, 
        pass: config.mailPass 
    }
});

// Configuración del email
export const gmailConfig = (ticket, email) => ({
    from: config.mailUser, 
    to: email,   
    subject: 'Purchase Ticket',
    html: purchaseTicketTemplate(ticket, email),
});

// Función para enviar el correo
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
