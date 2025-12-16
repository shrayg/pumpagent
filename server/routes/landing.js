import express from "express";
import { apiKeyMap } from "../utils/loadapikeys.js";
import { requestTracker } from "../utils/requests.js";
const landingInfoRouter = express.Router();

landingInfoRouter.get("/", async (req, res) => {
  try {
    const builders = Array.from(apiKeyMap).length;
    const httpsRoutes = 19;
    const totalTraffic = requestTracker.totalRequests;

    res.json({ builders, httpsRoutes, totalTraffic });
  } catch (err) {
    console.error(err);
  }
});

export default landingInfoRouter;
