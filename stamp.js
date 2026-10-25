// Runs after the build: gives app.js / style.css a fresh ?v= number so browsers never show an old copy.
const fs = require("fs");
const f = "site/index.html";
fs.writeFileSync(f, fs.readFileSync(f, "utf8").replace(/\?v=\d+/g, "?v=" + Date.now()));
