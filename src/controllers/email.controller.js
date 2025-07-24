import { gmailConfig, transporter, gmailChangePasswordConfig } from "../services/email.services.js";
import { userService } from '../services/user.services.js';
import { logger } from '../config/logger.js'; 

export const sendMailGmail = async (ticket, email) => {
    try {
        logger.info(`Intentando enviar email de ticket para: ${email}`);
        const mailOptions = gmailConfig(ticket, email);

        const response = await transporter.sendMail(mailOptions);

        if (response.accepted.length > 0) {
            logger.info(`Email de ticket enviado exitosamente a: ${email}. ID de mensaje: ${response.messageId}`);
        } else {
            logger.warn(`Email de ticket no aceptado por el servidor para: ${email}. Detalles: ${JSON.stringify(response.rejected)}`);
        }
    } catch (error) {
        logger.error(`Error al enviar email de ticket a ${email}:`, error);
        throw error;
    }
};


const generateToken = async (email) => {
    return jwt.sign({ email }, env.keyCookie, { expiresIn: '1h' });
};

export const sendMailChangePassword = async (req, res) => {
    try {
        const { email } = req.body;
        logger.info(`Solicitud para enviar email de cambio de contraseña para: ${email}`);

        if (!email) {
            logger.warn('Intento de solicitud de cambio de contraseña sin email proporcionado.');
            return res.status(400).json({ error: "Email is required" });
        }

        const token = await userService.generateTokenPassword(email);
        const resetLink = `http://localhost:8080/user/change-password?token=${token}`;
        logger.debug(`Token generado para ${email}. Link de reseteo: ${resetLink}`);

        const mailOptions = gmailChangePasswordConfig(resetLink, email);
        const response = await transporter.sendMail(mailOptions);

        logger.info(`Email de cambio de contraseña enviado exitosamente a: ${email}. ID de mensaje: ${response.messageId}`);
        res.status(200).json({ status: "success", message: "Password change email sent successfully", response });
    } catch (error) {
        logger.error(`Error al enviar email de cambio de contraseña para ${req.body.email || 'N/A'}:`, error);
        res.status(500).json({ status: "error", message: "Error sending Mail" });
    }
};