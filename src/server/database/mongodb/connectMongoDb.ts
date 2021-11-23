import * as Mongoose from "mongoose";

let connection: Mongoose.Connection;

export async function connectMongoDb() : Promise<Mongoose.Connection> {
  if (connection == null || connection.readyState !== 1) {
    const uri = process.env.MONGO_DB_URI;

    if (!uri) {
      throw new Error("MONGO_DB_URI must be set");
    }

    console.log("Connecting to MongoDB...");

    try {
      await Mongoose.connect(uri);
      connection = Mongoose.connections[0];

      await initialize();
      console.log("Connected to MongoDB");
    } 
    catch (error) {
      console.log("Error connecting to MongoDB: ", error);
    }
  }

  return connection;
}

async function initialize(){}
