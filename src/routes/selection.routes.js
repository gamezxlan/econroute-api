const express = require("express");
const router = express.Router();
const selectionController = require("../controllers/selection.controller");

router.post("/selection", selectionController.saveSelection);

module.exports = router;