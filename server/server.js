import dns from "dns";

dns.setServers(["8.8.8.8"]);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

let collection;

async function connectDB() {
  await client.connect();

  const db = client.db("ERP");
  collection = db.collection("ERP");

  console.log("MongoDB Atlas connected successfully");
}

app.post("/register", async (req, res) => {
  try {
    const participant = req.body;

    await collection.insertOne({
      name: participant.name,
      roll: participant.roll,
      division: participant.division,
      email: participant.email,
      programme: participant.programme,
      major: participant.major,
      minor: participant.minor,
      agree: participant.agree,
      createdAt: new Date()
    });

    res.json({
      success: true,
      message: "Registration successful"
    });

  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
});

connectDB()
  .then(() => {
    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });