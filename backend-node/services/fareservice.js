const axios = require("axios");

const calculateFare = async (distanceKm, bookingType) => {
  const response = await axios.post("http://localhost:8000/calculate-fare", {
    distance_km: distanceKm,
    booking_type: bookingType,
  });
  return response.data;
};

module.exports = { calculateFare };
