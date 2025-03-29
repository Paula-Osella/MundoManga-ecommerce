import { Router } from 'express';
import {  sendMailGmail, sendMailChangePassword } from '../controllers/email.controller.js';

const emailRouter = Router();

emailRouter.route('/send/gmail')
    .post(sendMailGmail)

    emailRouter.route('/send/change-password')
    .post(sendMailChangePassword) 


export default emailRouter;