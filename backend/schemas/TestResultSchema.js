import mongoose from "mongoose"
const { Schema } = mongoose;
export const TestResultSchema = new Schema({
    user: String,
    Score: String,
    career: String,
    skills: String,
    colleges: String,
    roadmap: String,
});