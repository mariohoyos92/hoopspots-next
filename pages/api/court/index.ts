import { NowRequest, NowResponse } from "@now/node";
import connectToMongoose from "../_database-connections/mongoose-connection";
import { getAllCourts, createCourt } from "../_repositories/court-repository";

export default async (req: NowRequest, res: NowResponse) => {
  await connectToMongoose();
  if (req.method === "GET") {
    const courts = await getAllCourts();
    res.json({ courts });
  }
  if (req.method === "POST") {
    const court = req.body;
    try {
      const createdCourt = await createCourt(court);
      res.status(201).json(createdCourt);
    } catch (err) {
      res.status(500);
    }
  }
};
