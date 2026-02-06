exports.calculateTotal = ({
  distanceKm,
  durationMin,
  durationTrafficMin,
  consumptionKmPerL,
  fuelPrice,
  tollsCost = 0,
}) => {
  // 1️⃣ Consumo base
  const fuelCruise = distanceKm / consumptionKmPerL;

  // 2️⃣ Tráfico
  const delayMin = Math.max(0, durationTrafficMin - durationMin);
  const idleFuelPerHour = 0.8; // litros por hora
  const fuelIdling = (delayMin / 60) * idleFuelPerHour;

  // 3️⃣ Congestión (heurístico)
  const trafficRatio = durationTrafficMin / durationMin;
  let congestionFactor = 1;

  if (trafficRatio > 1.6) congestionFactor = 1.6;
  else if (trafficRatio > 1.3) congestionFactor = 1.35;
  else if (trafficRatio > 1.1) congestionFactor = 1.15;

  const fuelCongestion = fuelCruise * (congestionFactor - 1);

  // 4️⃣ Total combustible
  const totalFuel =
    fuelCruise + fuelIdling + fuelCongestion;

  const fuelCost = totalFuel * fuelPrice;

  return {
    fuelLiters: Number(totalFuel.toFixed(2)),
    fuelCost: Number(fuelCost.toFixed(2)),
    totalCost: Number((fuelCost + tollsCost).toFixed(2)),
    breakdown: {
      cruise: fuelCruise,
      idling: fuelIdling,
      congestion: fuelCongestion,
    },
  };
};