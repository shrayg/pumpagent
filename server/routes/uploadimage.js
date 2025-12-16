import express from "express";
import { base64ToBlob } from "../utils/helpers.js";
import axios from "axios";
import { requestTracker } from "../utils/requests.js";
const uploadImageRouter = express.Router();

uploadImageRouter.post("/", async (req, res) => {
  const { image } = req.body;
  requestTracker.totalRequests++;

  const imgType = image.split(",")[0].slice(5);
  const blobImg = base64ToBlob(image, imgType.split(";")[0]);

  try {
    const formData = new FormData();
    formData.append("file", blobImg);
    // formData.append("name", "hello");

    const metadataResponse = await axios.post(
      "https://pump.fun/api/ipfs-file",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const response = { ...metadataResponse.data.metadata };
    console.log("Image upload: ", metadataResponse.data);
    response.uri = metadataResponse.data.fileUri;
    res.json(response);
  } catch (error) {
    console.error(error);
  }
});

export default uploadImageRouter;
