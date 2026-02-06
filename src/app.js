const express = require("express");
const cors = require("cors");
const decisionRoutes = require("./routes/decision.routes");
const selectionRoutes = require("./routes/selection.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/decision", decisionRoutes);
app.use("/decision", selectionRoutes);

module.exports = app;
