import { gmailConfig, transporter, gmailChangePasswordConfig } from "../services/email.services.js";

import { userService } from '../services/user.services.js';



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



const generateToken = async (email) => {

    return jwt.sign({ email }, env.keyCookie, { expiresIn: '1h' });

};



export const sendMailChangePassword = async (req, res) => {

    try {

        const { email } = req.body;



        if (!email) {

            return res.status(400).json({ error: "Email is required" });

        }





        const token = await userService.generateTokenPassword(email);

        const resetLink = `${process.env.BASE_URL}/change-password?token=${token}`;





        const mailOptions = gmailChangePasswordConfig(resetLink, email);

        const response = await transporter.sendMail(mailOptions);





        res.status(200).json({ status: "success", message: "Password change email sent successfully", response });

    } catch (error) {

        console.error("Error sending email:", error);

        res.status(500).json({ status: "error", message: "Error sending Mail" });

    }

};