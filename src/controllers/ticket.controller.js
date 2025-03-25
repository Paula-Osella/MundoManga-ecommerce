import { ticketService } from '../services/ticket.service';
import TicketOutputDTO from '../dtos/ticket.output.dto';  // DTO de salida

class TicketController {
    async getAllTickets(req, res, next) {
        try {
            const response = await ticketService.getAllTickets();
            res.status(200).send(response);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async createTicket(req, res, next) {
        try {
            const response = await ticketService.createTicket(req.body);
            res.status(201).send(response);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async createTicketFromCart(req, res, next) {
        const { amount, purchaser } = req.body;  
        try {
            const ticket = await ticketService.createTicketFromCart(amount, purchaser);
            res.status(201).send({ message: "Compra completada con éxito", ticket });
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = new TicketController();
