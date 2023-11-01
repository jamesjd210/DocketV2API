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

//GET by companyName 
docketRouter.get("/", async (req: Request, res: Response) => {
    //Check that the requests contains "company-name" field as a header
    const companyName = req.headers['company-name'] as string;
    if (!companyName) {
        return res.status(400).json( {error : "Missing company-name header"});
    }

    const query = {companyName : companyName};
    try {
        const docketObjects = await collections.docketObjects.find(query).toArray();
        res.status(200).send(docketObjects);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// GET all
docketRouter.get("/all", async (_req: Request, res: Response) => {
    try {
       const docketObjects = (await collections.docketObjects.find({}).toArray());

        res.status(200).send(docketObjects);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


//GET by ID
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
            ? res.status(201).send(`Successfully created a new Docket Object with id ${result.insertedId}`)
            : res.status(500).send("Failed to create a new Docket Object.");
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
            ? res.status(200).send(`Successfully updated Docket Object with id ${id}`)
            : res.status(304).send(`Docket Object with id: ${id} not updated`);
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
            res.status(202).send(`Successfully removed Docket Object with id ${id}`);
        } else if (!result) {
            res.status(400).send(`Failed to remove Docket Object with id ${id}`);
        } else if (!result.deletedCount) {
            res.status(404).send(`Docket Object with id ${id} does not exist`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

// DELETE All Docket Object
docketRouter.delete("/", async (_req: Request, res: Response) => {
    try {
        const result = await collections.docketObjects.deleteMany({});

        if (result && result.deletedCount) {
            res.status(202).send(`Successfully removed all Docket Object`);
        } else if (!result) {
            res.status(400).send(`Failed to remove all Docket Object`);
        } else if (!result.deletedCount) {
            res.status(404).send(`No Docket Object found to delete`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});
