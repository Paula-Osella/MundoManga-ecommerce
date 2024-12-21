import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const { Schema } = mongoose; 

const ProductsCollection = "products";

const productSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'El Título es obligatorio...'],
            trim: true,
            minLength: [3, 'Debe tener al menos 3 caracteres...'],
            maxLength: [50, 'Debe tener como máximo 50 caracteres...'],
        },
        description: {
            type: String,
            required: [true, 'La Descripción es obligatoria...'],
        },
        code: {
            type: String,
            required: [true, 'El Código es obligatorio...'],
            unique: true,
            index: true,
        },
        price: {
            type: Number,
            required: [true, 'El Precio es obligatorio...'],
            min: [0, 'El precio debe ser un valor positivo'],
        },
        stock: {
            type: Number,
            required: [true, 'El Stock es obligatorio...'],
            min: [0, 'El Stock debe ser un valor positivo...'],
        },
        category: {
            type: String,
            required: [true, 'La Categoría es obligatoria...'],
        },
        author: {
            type: String,
            required: [true, 'El autor es obligatorio...'],
        },
        status: {
            type: Boolean,
            required: [true, 'El Estado es obligatorio...'],
            default: true,
        },
        thumbnails: {
            type: [String],
            required: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

productSchema.plugin(paginate);

export const ProductModel = mongoose.model(ProductsCollection, productSchema);
export default ProductModel;
