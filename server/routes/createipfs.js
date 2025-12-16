import express from "express";
import { base64ToBlob } from "../utils/helpers.js";
import axios from "axios";
import { requestTracker } from "../utils/requests.js";
const createIPFSFRouter = express.Router();

createIPFSFRouter.post("/", async (req, res) => {
  const { image, name, symbol, description, twitter, telegram, website } =
    req.body;
  requestTracker.totalRequests++;

  const imgType = image.split(",")[0].slice(5);
  const blobImg = base64ToBlob(image, imgType.split(";")[0]);

  try {
    const formData = new FormData();
    formData.append("file", blobImg);
    formData.append("name", name);
    formData.append("symbol", symbol);
    formData.append("description", description);
    formData.append("twitter", twitter || "");
    formData.append("telegram", telegram || "");
    formData.append("website", website || "");
    formData.append("showName", true);

    const metadataResponse = await axios.post(
      "https://pump.fun/api/ipfs",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const response = { ...metadataResponse.data.metadata };
    response.uri = metadataResponse.data.metadataUri;
    res.json(response);
  } catch (error) {
    console.error(error);
  }
});

export default createIPFSFRouter;
