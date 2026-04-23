import mongoose from "mongoose"
const { Schema } = mongoose;
export const UserSchema = new Schema({
    name: String,
    email: String,
    phone: String,
    standard: String,
    marks: Number,
    hobbies: String,
    password: String,
})