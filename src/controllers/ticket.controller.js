import { ticketService } from '../services/ticket.service.js';
import TicketOutputDTO from '../dtos/ticket.output.dto.js';
import { logger } from '../config/logger.js';

class TicketController {
    async getAllTickets(req, res, next) {
        try {
            logger.info('Intentando obtener todos los tickets');
            const response = await ticketService.getAllTickets();
            logger.info(`Se obtuvieron ${response.length} tickets.`); 
            res.status(200).send(response);
        } catch (error) {
            logger.error('Error al obtener todos los tickets:', error); 
            next(error);
        }
    }

    async createTicket(req, res, next) {
        try {
            logger.info('Intentando crear un nuevo ticket'); 
            logger.debug('Datos para crear ticket:', req.body); 
            const response = await ticketService.createTicket(req.body);
            logger.info(`Ticket creado con éxito. ID: ${response._id}`); 
            res.status(201).send(response);
        } catch (error) {
            logger.error('Error al crear el ticket:', error); 

            next(error);
        }
    }

    async createTicketFromCart(req, res, next) {
        const { amount, purchaser } = req.body;
        logger.debug(`Intentando crear ticket desde carrito. Comprador: ${purchaser}, Monto: ${amount}`); 

        try {
            const ticket = await ticketService.createTicketFromCart(amount, purchaser);
            logger.info(`Ticket creado desde carrito con éxito. ID: ${ticket._id}, Comprador: ${purchaser}`); 
            res.status(201).send({ message: "Compra completada con éxito", ticket });
        } catch (error) {
            logger.error(`Error al crear ticket desde carrito para comprador ${purchaser}:`, error); 

            next(error);
        }
    }
}

export default new TicketController();

