// External Dependencies
import express, { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import Game from "../models/game";
// Global Config
export const gamesRouter = express.Router();

function apiKeyAuthMiddleware(request : Request, response : Response, next : NextFunction) {
    const apiKey = request.headers['api-key'] as string;
    if(isValidApiKey(apiKey)) {
        next();
    } else {
        response.status(401).json({ message : 'Unauthorized'});
    }
}

function isValidApiKey(apiKey : string) : boolean {
    return apiKey === process.env.API_KEY;
}

gamesRouter.use(apiKeyAuthMiddleware);

gamesRouter.use(express.json());
// GET
gamesRouter.get("/", async (_req: Request, res: Response) => {
    try {
       const games = (await collections.games.find({}).toArray());

        res.status(200).send(games);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

gamesRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        
        const query = { _id: new ObjectId(id) };
        const game = (await collections.games.findOne(query));

        if (game) {
            res.status(200).send(game);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});
// POST
gamesRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newGame = req.body as Game;
        const result = await collections.games.insertOne(newGame);

        result
            ? res.status(201).send(`Successfully created a new game with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new game.");
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});
// PUT
gamesRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedGame: Game = req.body as Game;
        const query = { _id: new ObjectId(id) };
      
        const result = await collections.games.updateOne(query, { $set: updatedGame });

        result
            ? res.status(200).send(`Successfully updated game with id ${id}`)
            : res.status(304).send(`Game with id: ${id} not updated`);
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
// DELETE
gamesRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections.games.deleteOne(query);

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed game with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove game with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Game with id ${id} does not exist`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

// DELETE All Games
gamesRouter.delete("/", async (_req: Request, res: Response) => {
    try {
        const result = await collections.games.deleteMany({});

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed all games`);
        } else if (!result) {
            res.status(400).send(`Failed to remove all games`);
        } else if (!result.deletedCount) {
            res.status(404).send(`No games found to delete`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
