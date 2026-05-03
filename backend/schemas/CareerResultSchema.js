const mongoose = require("mongoose");

const careerResultSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  result: {
    career: String,
    category: String,
    skills: [String],
    colleges: [String],
    roadmap: [String],
  },
  scores: {
    type: Object,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = careerResultSchema;