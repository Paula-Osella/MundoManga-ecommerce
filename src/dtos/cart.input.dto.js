export default class CartInputDTO {
    constructor(cart) {
        this.products = cart.products.map(product => ({
            prodId: product.prodId,  
            quantity: product.quantity
        }));
    }
}
