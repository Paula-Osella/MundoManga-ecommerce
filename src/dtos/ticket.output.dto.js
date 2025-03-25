// dtos/ticket.output.dto.js
class TicketOutputDTO {
    constructor(id, code, purchase_datetime, amount, purchaser) {
        this.id = id;
        this.code = code;
        this.purchase_datetime = purchase_datetime;
        this.amount = amount;
        this.purchaser = purchaser;
    }
}

export default TicketOutputDTO;
