import { Router } from 'express';
import {  sendMailGmail } from '../controllers/email.controller.js';

const emailRouter = Router();

emailRouter.route('/send/gmail')
    .post(sendMailGmail)



export default emailRouter;