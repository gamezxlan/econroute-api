const express = require("express");
const router = express.Router();
const decisionController = require("../controllers/decision.controller");

router.post("/route", decisionController.calculateRoute);

module.exports = router;
