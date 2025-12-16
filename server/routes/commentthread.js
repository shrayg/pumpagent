import express from "express";
import axios from "axios";
import { requestTracker } from "../utils/requests.js";

const commentThreadRouter = express.Router();

commentThreadRouter.post("/", async (req, res) => {
  requestTracker.totalRequests++;
  const { ca } = req.body;

  try {
    const url = `https://frontend-api-v3.pump.fun/replies/${ca}?limit=1000&offset=0`;

    const response = await axios.get(url, {
      headers: {
        origin: "https://pump.fun",
        accept: "*/*",
        "accept-language": "en,nl-NL;q=0.9,nl;q=0.8,en-US;q=0.7",
        "if-none-match": 'W/"347c-+yh+xYAfHMaJ6WDei/Rdm5LNvgw"',
        priority: "u=1, i",
        "sec-ch-ua":
          '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        referrer: "https://pump.fun/",
        referrerPolicy: "strict-origin-when-cross-origin",
        "Content-Type": "application/json",
      },
    });
    // Send JSON response to client
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching comments:", error.message);

    if (error.response) {
      // Server responded with a status outside 2xx
      return res.status(error.response.status).json({
        error: error.response.statusText || "Upstream error",
        details: error.response.data,
      });
    } else if (error.request) {
      // No response received
      return res.status(504).json({ error: "No response from server" });
    } else {
      // Request setup error
      return res
        .status(500)
        .json({ error: "Internal request error", message: error.message });
    }
  }
});

export default commentThreadRouter;
