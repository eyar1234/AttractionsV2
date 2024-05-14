const axios = require("axios");

async function getTheName(latitude, longitude) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_KEY}`
    );
    const data = response.data;

    if (data.status === "OK" && data.results.length > 0) {
      const addressComponents = data.results[0].address_components;
      let city = "";
      // Loop through address components to find the city
      for (let i = 0; i < addressComponents.length; i++) {
        if (addressComponents[i].types.includes("locality")) {
          city = addressComponents[i].long_name;
          break;
        }
      }

      return "new york"; // Return the city name
    } else {
      throw new Error(`Failed to fetch city: ${data.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error; // Rethrow the error to be handled by the caller
  }
}

async function getTheAttractions(name, limit = 40, pageToken = "") {
  try {
    let allResults = [];
    let nextPageToken = pageToken;
    let totalResultsFetched = 0;

    // Make the first request
    const firstResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${name}+point+of+interest&language=he&key=${process.env.GOOGLE_KEY}&PageToken=${nextPageToken}`
    );

    const firstData = firstResponse.data;

    const firstResults = firstData.results;

    // Add results from the first request to the array
    allResults.push(...firstResults);
    totalResultsFetched += firstResults.length;

    // If there's no next page token or if we've reached the limit, return the results
    if (!firstData.next_page_token || totalResultsFetched >= limit) {
      return allResults.slice(0, limit);
    }

    // Wait for 2 seconds before making the next request (as per Google's API documentation)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Make the second request using the nextPageToken from the first response
    nextPageToken = firstData.next_page_token;
    // Update nextPageToken for the second request
    const secondResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${name}+point+of+interest&language=he&key=${process.env.GOOGLE_KEY}&PageToken=${nextPageToken}`
    );

    const secondData = secondResponse.data;
    const secondResults = secondData.results;

    // Add results from the second request to the array
    allResults.push(...secondResults);
    totalResultsFetched += secondResults.length;

    // Return the combined results
    return allResults.slice(0, limit);
  } catch (error) {
    console.log(error);
    return []; // Return an empty array if there's an error
  }
}

async function ReferenceToSrc(photoReference, width = 400) {
  const res =
    await `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoReference}&maxwidth=${width}&key=${process.env.GOOGLE_KEY}`;
  return res;
}

module.exports = { getTheName, getTheAttractions, ReferenceToSrc };
