const decisionService = require("../services/decision.service");

exports.calculateRoute = async (req, res) => {
  try {
    const result = await decisionService.calculate(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
