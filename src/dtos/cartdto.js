// dtos/cart.dto.js
export default class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.products = cart.products.map(prod => ({
            productId: prod.product._id,
            quantity: prod.quantity,
            productName: prod.product.name, // Puedes agregar más datos del producto si es necesario
            productPrice: prod.product.price
        }));
    }
}
