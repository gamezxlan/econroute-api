const pool = require("../db");
const { v4: uuidv4 } = require("uuid");
const costCalculator = require("../utils/costCalculator");

exports.calculate = async ({ routes, vehicle, fuel_price_per_l, country }) => {
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

  if (!country || typeof country !== "string") {
    throw new Error("Invalid country");
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

  const costResult = costCalculator.calculateTotal({
    distanceKm: route.distanceKm,
    durationMin: route.durationMin,
    durationTrafficMin: route.durationTrafficMin,
    consumptionKmPerL: vehicle.consumption_km_per_l,
    fuelPrice: fuel_price_per_l,
    tollsCost: route.tollsCost || 0,
  });

  if (!costResult || isNaN(costResult.totalCost)) {
    throw new Error("Total cost calculation failed");
  }

  return {
    ...route,
    totalCost: costResult.totalCost,
    fuelCost: costResult.fuelCost,
    fuelLiters: costResult.fuelLiters,
    costBreakdown: costResult.breakdown,
  };
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

  try {
    await pool.query(
    `INSERT INTO route_decisions
    (country, fuel_price, vehicle_efficiency, routes_count, cheapest_route, routes)
    VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      country,
      fuel_price_per_l,
      vehicle.consumption_km_per_l,
      routes.length,
      cheapestRoute.routeId,
      JSON.stringify(routesWithCost)
    ]
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
