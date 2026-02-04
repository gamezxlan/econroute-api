const decisionService = require("../services/decision.service");

exports.calculateRoute = async (req, res) => {
  try {
    const result = await decisionService.calculate(req.body);
    res.json(result);
  } catch (error) {
    console.error("🔥 ERROR:", error); // <-- clave
    res.status(400).json({ error: error.message || "Unknown error"});
  }
};
