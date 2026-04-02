const fs = require("fs");
const path = require("path");
const http = require("http");
const https = require("https");
const express = require("express");

const app = express();
const buildPath = path.join(__dirname, "build");

app.use(express.static(buildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

const keyPath = path.join(__dirname, "cert", "key.pem");
const certPath = path.join(__dirname, "cert", "cert.pem");

const hasHttpsCert = fs.existsSync(keyPath) && fs.existsSync(certPath);

if (hasHttpsCert) {
  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };

  https.createServer(options, app).listen(3000, "0.0.0.0", () => {
    console.log("HTTPS server running on https://localhost:3000");
  });
} else {
  http.createServer(app).listen(3000, "0.0.0.0", () => {
    console.log("cert 폴더가 없어 HTTP 서버로 실행합니다.");
    console.log("HTTP server running on http://localhost:3000");
  });
}