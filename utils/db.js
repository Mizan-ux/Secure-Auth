import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const db = () => {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log("Connected to Mongodb");

        })
        .catch((err) => {
            console.error(`${err} Error connecting to mongodb`);
        });
}

export default db;