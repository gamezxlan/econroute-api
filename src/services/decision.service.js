const pool = require("../db");
const { v4: uuidv4 } = require("uuid");
const costCalculator = require("../utils/costCalculator");

exports.calculate = async ({ routes, vehicle, fuel_price_per_l }) => {
  if (!routes || !Array.isArray(routes)) {
    throw new Error("Invalid routes");
  }

  if (!vehicle || !vehicle.consumption_km_per_l) {
    throw new Error("Invalid vehicle data");
  }

  if (!fuel_price_per_l) {
    throw new Error("Invalid fuel price");
  }

  if (!routes || routes.length === 0) {
    throw new Error("No routes provided");
  }

  const routesWithCost = routes.map(route => {
  if (
    typeof route.distanceKm !== "number" ||
    typeof vehicle.consumption_km_per_l !== "number" ||
    vehicle.consumption_km_per_l <= 0 ||
    typeof fuel_price_per_l !== "number"
  ) {
    throw new Error("Invalid numeric values in input");
  }

  const totalCost = costCalculator.calculateTotal(
    route.distanceKm,
    vehicle.consumption_km_per_l,
    fuel_price_per_l,
    route.tollsCost || 0
  );

  if (isNaN(totalCost)) {
    throw new Error("Total cost calculation failed");
  }

  return { ...route, totalCost };
});


  const cheapestRoute = routesWithCost.reduce((a, b) =>
    a.totalCost < b.totalCost ? a : b
  );

  const decisionId = uuidv4();

  try {
    await pool.query(
      `INSERT INTO decisions (id, routes, cheapest_route)
      VALUES ($1, $2::jsonb, $3)`,
      [decisionId, JSON.stringify(routesWithCost), cheapestRoute.routeId]
    );
  } catch (dbError) {
    console.error("🔥 DB ERROR:", dbError);
    throw new Error("Database insert failed");
  }



  return {
    decisionId,
    cheapestRoute: cheapestRoute.routeId,
    routes: routesWithCost
  };
};
