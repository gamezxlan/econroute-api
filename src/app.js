const express = require("express");
const decisionRoutes = require("./routes/decision.routes");

const app = express();
app.use(express.json());

app.use("/decision", decisionRoutes);

module.exports = app;
