import mongoose from "mongoose"
const { Schema } = mongoose;
export const AdminSchema = new Schema({
    name: String,
    phone: Number,
    password: String,
});