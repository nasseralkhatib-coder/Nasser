// server.ts
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = Number(process.env.PORT) || 3e3;
app.use(express.json({ limit: "50mb" }));
app.get("/healthz", (req, res) => res.send("OK"));
app.get("/api/health", (req, res) => res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() }));
app.get(["/api/products", "/api/sync-products"], (req, res) => {
  const customProductsPath = path.resolve(__dirname, "src/data/customProducts.json");
  if (fs.existsSync(customProductsPath)) {
    try {
      const data = fs.readFileSync(customProductsPath, "utf8");
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "no-cache");
      res.send(data);
      return;
    } catch {
    }
  }
  res.json([]);
});
app.use("/images", express.static(path.resolve(__dirname, "dist/images"), { maxAge: 0 }));
app.use("/images", express.static(path.resolve(__dirname, "public/images"), { maxAge: 0 }));
app.use("/downloads", express.static(path.resolve(__dirname, "public/downloads")));
app.use("/downloads", express.static(path.resolve(__dirname, "dist/downloads")));
app.use(express.static(path.resolve(__dirname, "dist"), { index: "index.html" }));
app.all("*", (req, res) => {
  const indexPath = path.resolve(__dirname, "dist/index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Application build in progress, please refresh in a moment.");
  }
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Kemizone Server] Running on http://0.0.0.0:${PORT}`);
});
