const axios = require("axios");

const client = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    // 🔥 paste REAL cookie here
    Cookie: "partner_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NDdhOGFhOTFhM2EyMjk5YzNkMjU2YyIsInJvbGUiOiJwYXJ0bmVyIiwiaWF0IjoxNzY2NzQ1Njk1LCJleHAiOjE3NjczNTA0OTV9.ZRjhQ68AQBCqYDCOQUPrqyIbQ4wvEUYGQlLSFM-8f-A"
  }
});

// 🔥 paste REAL MongoDB order _id here
const ORDER_ID = "694e78ebc970b1eb4fb9ac26";

async function run() {
  console.log("Running concurrency test…");

  const r1 = client.patch("/order/status", {
    orderId: ORDER_ID,
    status: "accepted"
  });

  const r2 = client.patch("/order/status", {
    orderId: ORDER_ID,
    status: "accepted"
  });

  const results = await Promise.allSettled([r1, r2]);

  results.forEach((r, i) => {
  console.log(`\nRequest ${i + 1}:`);

  if (r.status === "fulfilled") {
    console.log("STATUS:", r.value.status);
    console.log("DATA:", r.value.data);
  } else {
    console.log("FAILED STATUS:", r.reason.response?.status);
    console.log("ERROR:", r.reason.response?.data || r.reason.message);
  }
});

}

run();
