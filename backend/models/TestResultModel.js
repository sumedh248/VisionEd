import mongoose from "mongoose"
import { TestResultSchema } from "../schemas/TestResultSchema.js"

const TestResultModel = mongoose.model('TestResult', TestResultSchema);

export default TestResultModel;