// External Dependencies
import express, { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import DocketObject from "../models/DocketObject";
// Global Config
export const docketRouter = express.Router();

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

docketRouter.use(apiKeyAuthMiddleware);

docketRouter.use(express.json());
// GET
docketRouter.get("/", async (_req: Request, res: Response) => {
    try {
       const docketObjects = (await collections.docketObjects.find({}).toArray());

        res.status(200).send(docketObjects);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

docketRouter.get("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        
        const query = { _id: new ObjectId(id) };
        const docketObject = (await collections.docketObjects.findOne(query));

        if (docketObject) {
            res.status(200).send(docketObject);
        }
    } catch (error) {
        res.status(404).send(`Unable to find matching document with id: ${req.params.id}`);
    }
});
// POST
docketRouter.post("/", async (req: Request, res: Response) => {
    try {
        const newDocketObject = req.body as DocketObject;
        const result = await collections.docketObjects.insertOne(newDocketObject);

        result
            ? res.status(201).send(`Successfully created a new game with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new game.");
    } catch (error) {
        console.error(error);
        res.status(400).send(error.message);
    }
});
// PUT
docketRouter.put("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const updatedDocketObject: DocketObject = req.body as DocketObject;
        const query = { _id: new ObjectId(id) };
      
        const result = await collections.docketObjects.updateOne(query, { $set: updatedDocketObject });

        result
            ? res.status(200).send(`Successfully updated game with id ${id}`)
            : res.status(304).send(`Game with id: ${id} not updated`);
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});
// DELETE
docketRouter.delete("/:id", async (req: Request, res: Response) => {
    const id = req?.params?.id;

    try {
        const query = { _id: new ObjectId(id) };
        const result = await collections.docketObjects.deleteOne(query);

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
docketRouter.delete("/", async (_req: Request, res: Response) => {
    try {
        const result = await collections.docketObjects.deleteMany({});

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
