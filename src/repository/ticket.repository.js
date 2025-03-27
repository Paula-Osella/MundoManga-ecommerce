import TicketOutputDTO from '../dtos/ticket.output.dto.js';
import ticketDAO from '../daos/mongodb/ticket.dao.js';  

class TicketRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getAllTickets() {
        try {
            const response = await this.dao.getAllTickets();
            return response.map(ticket => new TicketOutputDTO(ticket));
        } catch (e) {
            throw new Error(e);
        }
    }

    async createTicket(ticket) {
        try {
            const response = await this.dao.createTicket(ticket);
            return new TicketOutputDTO(response);
        } catch (e) {
            throw new Error(e);
        }
    }

    async createTicketFromCart(amount, purchaser) {
        try {
            const ticket = { amount, purchaser };
            console.log("Ticket data being created:", ticket); 
            if (!purchaser) throw new Error("Purchaser (email) is required");  
            const createdTicket = await this.dao.createTicket(ticket);
            return new TicketOutputDTO(createdTicket);
        } catch (e) {
            throw new Error("Error creating ticket from cart: " + e.message);
        }
    }
    }
 
export const ticketRepository = new TicketRepository(ticketDAO);