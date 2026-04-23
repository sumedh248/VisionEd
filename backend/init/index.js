import mongoose from "mongoose";
import initDB from "./data.js";
import AdminModel from "../models/AdminModel.js";
import TestResultModel from "../models/TestResultModel.js";
import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env") });

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/roadguests";
const DB_NAME = "test";

// admin insertion
// const init = async () => {
//    await AdminModel.deleteMany({});
//    const inserted = await AdminModel.insertMany(initDB.dataAdmin);
//    console.log(`data inserted: ${inserted.length} admin records`);
// };


// testresults 
const init = async () =>{
   await TestResultModel.deleteMany({});
   await TestResultModel.insertMany(initDB.dataTestResult);
   console.log("data inserted");
}

const runSeed = async () => {
   try {
      await mongoose.connect(MONGO_URL, { dbName: DB_NAME });
      console.log(`connected to db: ${DB_NAME}`);
      await init();
      console.log("seeding completed");
   } catch (err) {
      console.error("seeding failed", err);
   } finally {
      await mongoose.connection.close();
      console.log("db connection closed");
   }
};

runSeed();