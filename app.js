const express = require("express");
const https = require("https");
const app = express();
const port = process.env.PORT || 3001;

const STORE = process.env.SHOPIFY_STORE;
const TOKEN = process.env.SHOPIFY_TOKEN;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/shopify", (req, res) => {
  const path = req.query.path;
  if (!path) return res.status(400).json({ error: "Missing path" });

  const options = {
    hostname: STORE,
    path: `/admin/api/2026-04/${path}`,
    headers: { "X-Shopify-Access-Token": TOKEN }
  };

  https.get(options, (shopRes) => {
    let data = "";
    shopRes.on("data", chunk => data += chunk);
    shopRes.on("end", () => {
      res.header("Content-Type", "application/json");
      res.send(data);
    });
  }).on("error", (e) => res.status(500).json({ error: e.message }));
});

app.listen(port, () => console.log(`Proxy running on port ${port}`));
