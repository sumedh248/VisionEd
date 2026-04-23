import mongoose from "mongoose"
import { AdminSchema } from "../schemas/AdminSchema.js"

const AdminModel = mongoose.model('Admin', AdminSchema);

export default AdminModel;