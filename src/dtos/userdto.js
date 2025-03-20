export class UserDTO {
    constructor(user) {
        this.id = user._id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.role = user.role;
        // Si no quieres enviar el carrito, quítalo o agrégalo según lo necesites
        this.cart = user.cart; 
    }
}
