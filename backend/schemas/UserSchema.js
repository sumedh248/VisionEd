import mongoose from "mongoose"
const { Schema } = mongoose;
export const UserSchema = new Schema({
    name: String,
    email: String,
    phone: Number,
    password: String,
    standard:String,
    marks:String,
    hobbies:String,
})