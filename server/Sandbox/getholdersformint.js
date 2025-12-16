import { heliusRPCURL } from "../utils/constants.js";

const url = heliusRPCURL();

const payload = {
  jsonrpc: "2.0",
  id: 10,
  method: "getProgramAccounts",
  params: [
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    {
      encoding: "jsonParsed",
      filters: [
        {
          dataSize: 165,
        },
        {
          memcmp: {
            offset: 0,
            bytes: "3Qi8Z23AFBTgG1yQ8gZ9wK8R7h78EtiBzsjsND4Qpump", // Replace this with the actual token mint address
          },
        },
      ],
    },
  ],
};

fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("Response:", data);
    console.log(data.result[0].account);
    console.log(data.result[0].account.data.parsed.info);
    const owner = data.result[0].account.data.parsed.info.owner;
    const balance = data.result[0].account.data.parsed.info.tokenAmount.amount;
  })
  .catch((error) => {
    console.error("Error:", error);
  });
