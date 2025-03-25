// dtos/ticket.input.dto.js
class TicketInputDTO {
    constructor(amount, purchaser) {
        this.amount = amount;
        this.purchaser = purchaser;
    }
}

module.exports = TicketInputDTO;
