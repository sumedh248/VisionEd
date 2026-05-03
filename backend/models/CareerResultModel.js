const mongoose = require("mongoose");
const careerResultSchema = require("../schemas/careerResult.schema");

const CareerResult = mongoose.model("CareerResult", careerResultSchema);

module.exports = CareerResult;