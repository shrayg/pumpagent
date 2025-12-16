const res = await fetch(
  "https://lite-api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112&vsToken=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
);
const { data } = await res.json();

// Extract the price
const soPrice = parseFloat(
  data["So11111111111111111111111111111111111111112"].price
);

console.log("Price:", soPrice);
