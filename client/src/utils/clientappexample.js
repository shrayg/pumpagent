export const tokenBumpReactCode = `
import { useState } from "react";

const paymentPlan = [
  {
    duration: "15 Minutes",
    price: "0.15 SOL",
  },
  {
    duration: "30 Minutes",
    price: "0.25 SOL",
    saving: "17%",
  },
  {
    duration: "1 Hour",
    price: "0.45 SOL",
    saving: "25%",
  },
];

const randomUser = (length) =>
  [...Array(length)].map(() =>
      "abcdefghijklmnopqrstuvwxyz0123456789".charAt(
        Math.floor(Math.random() * 36))).join("");

const TurboBumper = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(randomUser(32)); // Random user ID on page visit
  const [plan, setPlan] = useState(paymentPlan[0]);
  const [ca, setCa] = useState("");
  const [step, setStep] = useState("form"); // form -> payment -> bumping
  const [paymentAddress, setPaymentAddress] = useState(""); // Dynamically fetched from our server

  const handleSubmit = async () => {
    if (ca) setStep("payment");
    requestPayment();
  };

  const requestPayment = async () => {
    try {
      const request = await fetch("http://localhost:3000/request-payment", {
        method: "POST",
        body: JSON.stringify({
          user,
          ca,
          plan,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { bumpPaymentWallet } = await request.json();
      setPaymentAddress(bumpPaymentWallet);
    } catch (err) {
      console.error(err);
      alert(err)
    }
  };

  const confirmPayment = async () => {
    setLoading(true);

    try {
      const request = await fetch("http://localhost:3000/confirm-payment", {
        method: "POST",
        body: JSON.stringify({ user }),
        headers: { "Content-Type": "application/json" },
      });
      
      const response = await request.json();
      if (response.error) throw new Error(response.error);

      // Payment successful, bump starting
      setStep("bumping");
      setUser(randomUser(32)); // New user ID in case of second purchase
    } catch (err) {
      console.error(err);
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 w-lg h-[400px] mx-auto text-center border rounded-xl shadow-lg text-[12px] flex flex-col">
      <h1 className="text-2xl font-bold mb-0">Turbo Bumper</h1>
      <p className="mb-4">Your go-to bumping service for pump.fun tokens</p>

      {step === "form" && (
        <>
          <input
            className="border border-gray-700 p-4 w-full mb-8 outline-none focus:bg-[#33333350] rounded-md mt-8"
            placeholder="Enter Pump Contract Address to Bump"
            value={ca}
            onChange={(e) => setCa(e.target.value)}
          />

          <div className="mb-4 space-x-2 flex justify-center items-center">
            {paymentPlan.map((d, i) => (
              <button
                key={i}
                className={\`px-3 py-2 border border-gray-800 rounded cursor-pointer flex flex-col gap-2 items-center justify-center relative w-1/3 \${
                  plan?.duration === d?.duration ? "bg-green-500" : "bg-black"
                }\`}
                onClick={() => setPlan(d)}
              >
                <span className="text-[20px]">{d.price}</span>
                <span className="text-[12px]">{d.duration}</span>
                <span className="absolute bottom-[-20px] text-[#3bd08e] font-bold">
                  {d.saving && "Save " + d.saving + "!"}
                </span>
              </button>
            ))}
          </div>

          <button
            className="bg-green-700 hover:bg-green-500 text-white px-4 py-3 rounded mt-8 cursor-pointer"
            onClick={handleSubmit}
          >
            Continue
          </button>
        </>
      )}

      {step === "payment" && (
        <div className="flex flex-col">
          <button
            className="mr-auto bg-gray-900 hover:bg-gray-700 p-2 rounded-md cursor-pointer"
            onClick={() => setStep("form")}
          >
            Back
          </button>
          <p className="mb-2 mt-10">Send {plan?.price} To:</p>
          <div className="text-white font-mono mb-2 bg-[#3333338e] p-4 rounded-lg">
            {paymentAddress}
          </div>
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded cursor-pointer mt-10"
            onClick={confirmPayment}
            disabled={loading ? true : false}
          >
            {loading ? "Loading" : "Confirm Payment"}
          </button>
        </div>
      )}

      {step === "bumping" && (
        <div className="flex flex-col items-center gap-2 text-[20px] mt-0">
          <button
            className="mr-auto bg-gray-900 hover:bg-gray-700 p-2 mb-15 rounded-md cursor-pointer"
            onClick={() => setStep("form")}
          >
            Back
          </button>
          <p>Token Bump Active!</p>
        </div>
      )}
    </div>
  );
};

export default TurboBumper;
`;

export const requestPaymentReact = `
// Client side payment request
const requestPayment = async () => {
  try {
    const request = await fetch("http://localhost:3000/request-payment", {
      method: "POST",
      body: JSON.stringify({
        user,
        ca,
        plan,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const { bumpPaymentWallet } = await request.json();
    setPaymentAddress(bumpPaymentWallet);
  } catch (err) {
    console.error(err);
    alert(err);
  }
};`;
