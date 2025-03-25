import { Schema, model } from "mongoose";
import ProductModel from './product.model.js';
export const cartSchema = new Schema({
    products: [
        {
            _id: false,
            quantity: {
                type: Number,
                default: 1
            },
            product: {
                type: Schema.Types.ObjectId,
                ref: "products"
            }
        }
    ]
});

const CartModel = model("carts", cartSchema);


export default CartModel;
