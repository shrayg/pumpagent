import axios from "axios";

axios
  .get(
    "https://swap-api.pump.fun/v1/pools/E9Gf46ex5SBVUPqu9VqSRncp12XVQfBNsugoydiSi3PM/candles",
    {
      params: {
        interval: "1m",
        limit: 1000,
        currency: "SOL",
        before_ts: 1750640100,
      },
      headers: {
        accept: "*/*",
        "accept-language": "en,nl-NL;q=0.9,nl;q=0.8,en-US;q=0.7",
        "if-none-match": 'W/"4b71-OEFirksdUsfsjC1Re4Ez0OG6pCg"',
        priority: "u=1, i",
        "sec-ch-ua":
          '"Google Chrome";v="137", "Chromium";v="137", "Not/A)Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        Referer: "https://swap.pump.fun/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
    }
  )
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error("Error fetching candles:", error.message);
  });
