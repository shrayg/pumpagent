import axios from "axios";

const addresses = ["7iagMTDPfNSR5zVcERT1To7A9eaQoz58dJAh42EMHcCC"];

async function sendAddresses(index) {
  try {
    const response = await axios.post("http://localhost:3000/token-price", {
      addresses,
    });
    console.log(response.data);
    console.log(`Request ${index + 1} Time:`, response.data.response.timeTaken);
  } catch (error) {
    console.error(`Request ${index + 1} Error:`, error.message);
  }
}

async function run() {
  for (let i = 0; i < 250; i++) {
    await sendAddresses(i);
  }
}

run();
