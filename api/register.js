import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    await client.connect();

    const db = client.db("ERP");
    const collection = db.collection("ERP");

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
      createdAt: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Registration successful",
    });

  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
}