// test-helius.js

// Replace with your actual Helius API key
const HELIUS_API_KEY = "";

async function testHelius() {
  const url = `https://api.helius.xyz/v0/addresses?api-key=${HELIUS_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    console.log("Helius API response:", data);
  } catch (err) {
    console.error("Error contacting Helius:", err.message);
  }
}

testHelius();
