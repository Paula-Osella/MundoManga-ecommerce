import MongoDao from './mongo.dao.js';
import  Ticket  from '../models/ticket.model.js';


class TicketDao extends MongoDao {
    constructor() {
        super(Ticket); 
    }

    async getAllTickets() {
        try {
            return await this.model.find();
        } catch (e) {
            throw new Error("Error retrieving tickets");
        }
    }

    async createTicket(body) {
        try {
            return await this.model.create(body);
        } catch (e) {
            throw new Error("Error creating ticket");
        }
    }

}

export default new TicketDao();
