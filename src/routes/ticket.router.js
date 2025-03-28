import { Router } from "express";
import  ticketController  from '../controllers/ticket.controller.js';

const ticketRouter = Router();


ticketRouter.route("/purchase")
    .post(ticketController.createTicketFromCart);  
ticketRouter.route("/")
    .get(ticketController.getAllTickets)
    .post(ticketController.createTicket);

export default ticketRouter;