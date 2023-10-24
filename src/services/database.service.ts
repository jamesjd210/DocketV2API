// External Dependencies
import * as mongoDB from "mongodb";

// Global Variables
export const collections: { docketObjects?: mongoDB.Collection } = {}
// Initialize Connection
export async function connectToDatabase () {
 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);
   
    const docketObjectCollection: mongoDB.Collection = db.collection(process.env.DOCKETOBJECT_COLLECTION_NAME);
 
    collections.docketObjects = docketObjectCollection;
       
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${docketObjectCollection.collectionName}`);
 }