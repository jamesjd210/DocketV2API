import express from "express";
import { connectToDatabase } from "./services/database.service"
import { gamesRouter } from "./routes/games.router";
import cors from 'cors';
const app = express();
const port = process.env.PORT || 8080; // default port to listen
const allowedOrigins = ["https://www.docket.dev", "https://docketv1.streamlit.app", "http://localhost:3000"]

const corsOptions = {
  origin : allowedOrigins,
};

app.use(cors(corsOptions));
// ** TODO ** Replace this code with a call to your games router class to handle all calls to /games endpoint
connectToDatabase()
    .then(() => {
        app.use("/games", gamesRouter);

        app.listen(port, () => {
            console.log(`Server started at http://localhost:${port}`);
        });
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit(1);
    });
