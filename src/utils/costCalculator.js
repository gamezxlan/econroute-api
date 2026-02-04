exports.calculateTotal = (
  distanceKm,
  consumptionKmPerL,
  fuelPrice,
  tollsCost
) => {
  const fuelUsed = distanceKm / consumptionKmPerL;
  const fuelCost = fuelUsed * fuelPrice;
  return fuelCost + tollsCost;
};
