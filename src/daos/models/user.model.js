import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,

    },
    password: {
        type: String,
        required: true,
        default: ' ',
    },
    role: {
        type: String,
        default: "user",
    },
    image: {
        type: String,
    },
    isGithub: {
        type: Boolean,
        default: false
    },
    isGoogle: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: "carts",
        default: null
    }
});

export const UserModel = model("users", UserSchema);