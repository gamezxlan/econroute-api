const pool = require("../db");

exports.saveSelection = async (req, res) => {
  const { decisionId, selectedRoute, recommendedRoute } = req.body;

  if (!decisionId || !selectedRoute || !recommendedRoute) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const wasRecommended = selectedRoute === recommendedRoute;

  try {
    await pool.query(
      `INSERT INTO route_selections
       (decision_id, selected_route, recommended_route, was_recommended)
       VALUES ($1, $2, $3, $4)`,
      [decisionId, selectedRoute, recommendedRoute, wasRecommended]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("🔥 DB ERROR:", err);
    res.status(500).json({ error: "Insert failed" });
  }
};