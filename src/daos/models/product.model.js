import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const { Schema } = mongoose; 

const ProductsCollection = "products";

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
  });

productSchema.plugin(paginate);

export const ProductModel = mongoose.model(ProductsCollection, productSchema);
export default ProductModel;
