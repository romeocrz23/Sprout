const express = require("express");
const cors = require("cors");

const app = express();
const healthRoutes = require("./routes/health.routes");

app.use(cors());
app.use(express.json());

app.use("/api", healthRoutes);

module.exports = app;
