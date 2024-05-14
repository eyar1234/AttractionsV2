const https = require("https");
const fs = require("fs");
const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app.js");

// Load SSL certificate and key
const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};
mongoose.connection.once("open", () => {
  console.log("mongoDB connection");
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});
const server = https.createServer(options, app);
async function startServer() {
  mongoose.connect(process.env.MONGO_URL);

  server.listen(process.env.PORT, () =>
    console.log(`Server is running on port ${process.env.PORT}`)
  );
}

startServer();
