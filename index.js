const express = require("express");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "EconRoute API running 🚗💸" });
});

app.post("/decision/route", (req, res) => {
  const { routes, vehicle, fuel_price_per_l } = req.body;

  if (!routes || routes.length === 0) {
    return res.status(400).json({ error: "No routes provided" });
  }

  const routesWithCost = routes.map(route => {
    const fuelUsed = route.distanceKm / vehicle.consumption_km_per_l;
    const fuelCost = fuelUsed * fuel_price_per_l;
    const totalCost = fuelCost + (route.tollsCost || 0);

    return {
      ...route,
      totalCost
    };
  });

  const cheapestRoute = routesWithCost.reduce((a, b) =>
    a.totalCost < b.totalCost ? a : b
  );

  res.json({
    cheapestRoute: cheapestRoute.routeId,
    routes: routesWithCost
  });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
