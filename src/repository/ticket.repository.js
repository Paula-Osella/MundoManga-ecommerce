import TicketOutputDTO from '../dtos/ticket.output.dto.js';
import ticketDAO from '../daos/mongodb/ticket.dao.js';  
import { logger } from '../config/logger.js';

class TicketRepository {
    constructor(dao) {
        this.dao = dao;
        logger.info('Instancia de TicketRepository creada.'); 
    }

    async getAllTickets() {
        try {
            logger.debug('Iniciando obtención de todos los tickets desde el DAO.'); 
            const response = await this.dao.getAllTickets();
            logger.info(`Se obtuvieron ${response.length} tickets del DAO.`); 
            return response.map(ticket => new TicketOutputDTO(ticket));
        } catch (e) {
            logger.error('Error en TicketRepository al obtener todos los tickets:', e); 
            throw new Error(e);
        }
    }

    async createTicket(ticket) {
        try {
            logger.debug('Iniciando creación de ticket en el DAO con datos:', ticket); 
            const response = await this.dao.createTicket(ticket);
            logger.info(`Ticket creado en el DAO con ID: ${response._id}`); 
            return new TicketOutputDTO(response);
        } catch (e) {
            logger.error('Error en TicketRepository al crear el ticket:', e);
            throw new Error(e);
        }
    }

    async createTicketFromCart(amount, purchaser) {
        try {
            const ticket = { amount, purchaser };
            logger.debug("Ticket data being created from cart:", ticket); 


            if (!purchaser) {
                logger.warn("Purchaser (email) es requerido para crear ticket desde carrito."); 
                throw new Error("Purchaser (email) is required");
            }

            const createdTicket = await this.dao.createTicket(ticket);
            logger.info(`Ticket creado desde carrito con éxito. ID: ${createdTicket._id}, Comprador: ${purchaser}`); 
            return new TicketOutputDTO(createdTicket);
        } catch (e) {
            logger.error(`Error en TicketRepository al crear ticket desde carrito para comprador ${purchaser || 'N/A'}:`, e);
            throw new Error("Error creating ticket from cart: " + e.message);
        }
    }
}

export const ticketRepository = new TicketRepository(ticketDAO);