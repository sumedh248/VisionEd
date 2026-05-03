import mongoose from "mongoose"
const { Schema } = mongoose;
export const TestResultSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    score: Number,
    category: String,
    career: String,
    skills: [String],
    colleges: [String],
    roadmap: [String],
    roadmapSteps: [
        {
            title: String,
            description: String,
        },
    ],
    scores: {
        analytical: Number,
        creativity: Number,
        social: Number,
        tech: Number,
    },
    mlPredictions: [
        {
            career: String,
            match: Number,
        },
    ],
    sources: {
        mlModel: String,
        roadmapModel: String,
        skillsModel: String,
    },
}, { timestamps: true });
