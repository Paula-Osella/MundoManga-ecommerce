export default class CartOutputDTO {
    constructor(cart) {
        this.id = cart._id;
        this.products = cart.products.map(item => ({
            prodId: item.product ? item.product._id : null,
            title: item.product ? item.product.title : "Unknown Product",
            price: item.product ? item.product.price : 0,
            quantity: item.quantity,
        }));
    }
}
