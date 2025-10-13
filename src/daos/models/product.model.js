// src/daos/models/product.model.js
import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const { Schema } = mongoose;

const ProductsCollection = "products";

const productSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true }, 
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true }, 
  author: { type: String, required: false },
  status: { type: Boolean, default: true },
  thumbnails: { type: [String], default: [] }
});

productSchema.plugin(paginate);

export const ProductModel = mongoose.model(ProductsCollection, productSchema);
export default ProductModel;