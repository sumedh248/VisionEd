import express from "express";
import UserModel from "./models/UserModel.js";
import mongoose from "mongoose";
import dotenv from "dotenv";  
dotenv.config();

const app=express();
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL;

app.get("/allUsers",async (req,res)=>{
    let tempUsers = [
    {
        name: "Rahul Sharma",
        email: "rahul.sharma@gmail.com",
        phone: 9876543210,
        password: "Rahul@123",
        standard: "12th",
        marks: "92%",
        hobbies: "Cricket, Reading"
    },
    {
        name: "Priya Patel",
        email: "priya.patel@gmail.com",
        phone: 8765432109,
        password: "Priya@456",
        standard: "11th",
        marks: "88%",
        hobbies: "Dancing, Painting"
    },
    {
        name: "Amit Desai",
        email: "amit.desai@yahoo.com",
        phone: 7654321098,
        password: "Amit@789",
        standard: "10th",
        marks: "95%",
        hobbies: "Football, Gaming"
    },
    {
        name: "Sneha Kulkarni",
        email: "sneha.kulkarni@outlook.com",
        phone: 6543210987,
        password: "Sneha@321",
        standard: "12th",
        marks: "78%",
        hobbies: "Singing, Cooking"
    },
    {
        name: "Vikram Singh",
        email: "vikram.singh@gmail.com",
        phone: 9512367845,
        password: "Vikram@654",
        standard: "11th",
        marks: "85%",
        hobbies: "Chess, Coding"
    },
    {
        name: "Anjali Mehta",
        email: "anjali.mehta@gmail.com",
        phone: 9823456710,
        password: "Anjali@987",
        standard: "10th",
        marks: "90%",
        hobbies: "Drawing, Swimming"
    },
    {
        name: "Rohan Joshi",
        email: "rohan.joshi@gmail.com",
        phone: 7896541230,
        password: "Rohan@111",
        standard: "12th",
        marks: "72%",
        hobbies: "Basketball, Music"
    },
    {
        name: "Neha Gupta",
        email: "neha.gupta@outlook.com",
        phone: 8907654321,
        password: "Neha@222",
        standard: "11th",
        marks: "96%",
        hobbies: "Reading, Yoga"
    },
    {
        name: "Arjun Nair",
        email: "arjun.nair@yahoo.com",
        phone: 9345678901,
        password: "Arjun@333",
        standard: "10th",
        marks: "81%",
        hobbies: "Cycling, Photography"
    },
    {
        name: "Pooja Verma",
        email: "pooja.verma@gmail.com",
        phone: 9012345678,
        password: "Pooja@444",
        standard: "12th",
        marks: "89%",
        hobbies: "Sketching, Gardening"
    }
];
await UserModel.insertMany(tempUsers);
res.send("Data inserted");

})

mongoose.connect(MONGO_URL)
.then(() => {
    console.log("MongoDB Atlas Connected");
    app.listen(3002, () => {
        console.log("Server running on port 3002");
    });
})
.catch((err) => {
    console.log("Connection Failed", err.message);
})