require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const routes = require("./routes");

const PORT = process.env.PORT || 7000;

const app = express();

app.use(express.static("../client/build"));

app.use(express.json());
app.use(cookieParser());

app.use("/", routes);

mongoose.connect(process.env.DB_URL).then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
