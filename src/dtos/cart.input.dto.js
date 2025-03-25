export default class CartInputDTO {
    constructor(cart) {
        this.products = cart.products.map(product => ({
            prodId: product.prodId,  // Asegura que solo recibimos el ID
            quantity: product.quantity
        }));
    }
}
