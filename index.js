const { response } = require("express");
const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/pages/index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/pages/about.html"));
});

app.get("/contact-me", (req, res) => {
  res.sendFile(path.join(__dirname, "/pages/contact-me.html"));
});

app.get("/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "/pages/styles.css"));
});

app.use(express.static("pages"));
app.listen(PORT);
