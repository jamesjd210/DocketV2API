import express from "express";
import { connectToDatabase } from "./services/database.service"
import { docketRouter } from "./routes/DocketObjects.router";
import * as dotenv from "dotenv";
import cors from 'cors';
const app = express();
const port = process.env.PORT || 8081; // default port to listen
dotenv.config();
const allowedOrigins = ["http://localhost:3000", process.env.ALLOWED_ORIGINS];
console.log(allowedOrigins)
const corsOptions = {
  origin : allowedOrigins,
};

app.use(cors(corsOptions));
// ** TODO ** Replace this code with a call to your games router class to handle all calls to /docket endpoint
connectToDatabase()
    .then(() => {
        app.use("/docket", docketRouter);

        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit(1);
    });
