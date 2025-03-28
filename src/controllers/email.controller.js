import { gmailConfig, transporter } from "../services/email.services.js";

export const sendMailGmail = async (ticket, email) => {
    try {
        const mailOptions = gmailConfig(ticket, email);

        const response = await transporter.sendMail(mailOptions);

        if (response.accepted.length > 0) {
            console.log('Email sent successfully');
        } else {
            console.log('Email not accepted');
        }
    } catch (error) {
        console.log('Error sending email:', error);
        throw error;
    }
};