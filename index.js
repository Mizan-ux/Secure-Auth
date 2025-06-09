import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import db from "./utils/db.js";
import userRoutes from "./routes/user.route.js"
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.js";
const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['get', 'post', 'put', 'update', 'delete'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.send('home page')

})

db();

//user routes
app.use("/api/v1/users", userRoutes);
app.use(errorHandler);
app.listen(port, () => {
    console.log(`example app listening on part ${port}`);
})