const { Client } = require("@googlemaps/google-maps-services-js");

const client = new Client({});

async function getDistanceInKm(origin, destination) {
  try {
    const response = await client.distancematrix({
      params: {
        origins: [origin],
        destinations: [destination],
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const element = response.data.rows[0].elements[0];

    if (!element || element.status !== "OK") {
      throw new Error("Distance not found");
    }

    return element.distance.value / 1000; // meters → km
  } catch (error) {
    console.error("Google Maps error:", error.message);
    throw error;
  }
}

module.exports = {
  getDistanceInKm,
};
