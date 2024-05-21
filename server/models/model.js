const axios = require("axios");
const attraction = require("./model.mongo");

async function getCityName(latitude, longitude) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_KEY}`
    );
    const data = response.data;

    if (data.status === "OK" && data.results.length > 0) {
      const addressComponents = data.results[0].address_components;
      let city = "";

      for (let i = 0; i < addressComponents.length; i++) {
        if (addressComponents[i].types.includes("locality")) {
          city = addressComponents[i].long_name;
          break;
        }
      }

      return city; // Return the extracted city name
    } else {
      throw new Error(`Failed to fetch city: ${data.status}`);
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

async function getAttractions(city, limit = 40, pageToken = "") {
  try {
    let allResultsRow = [];
    let allResults;
    let nextPageToken = pageToken;
    let totalResultsFetched = 0;

    do {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${city}+point+of+interest&language=he&key=${process.env.GOOGLE_KEY}&PageToken=${nextPageToken}`
      );

      const data = response.data;
      const results = data.results;

      allResultsRow.push(...results);
      totalResultsFetched += results.length;

      if (!data.next_page_token || totalResultsFetched >= limit) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
      nextPageToken = data.next_page_token;
    } while (totalResultsFetched < limit); // Continue fetching until the limit is reached

    // Filter out objects with photoReference set to undefined
    const filteredResultsRow = allResultsRow.filter(
      (obj) =>
        obj.photos &&
        obj.photos[0] &&
        obj.photos[0].photo_reference !== undefined
    );

    allResults = filteredResultsRow.map((obj) => ({
      city: city,
      name: obj.name,
      rating: obj.rating,
      address: obj.formatted_address,
      photoReference: obj.photos[0].photo_reference,
    }));

    // Remove duplicates based on the name property
    const uniqueDataArray = allResults.filter(
      (obj, index, array) =>
        array.findIndex((item) => item.name === obj.name) === index
    );

    await saveAttractions(uniqueDataArray);

    return uniqueDataArray.slice(0, limit);
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function ReferenceToSrc(photoReference, width = 400) {
  return `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoReference}&maxwidth=${width}&key=${process.env.GOOGLE_KEY}`;
}

async function saveAttractions(data) {
  const bulkOps = data.map((obj) => ({
    updateOne: {
      filter: { name: obj.name },
      update: { $set: obj },
      upsert: true,
    },
  }));

  try {
    const result = await attraction.bulkWrite(bulkOps);
    console.log("Upsert result:", result);
  } catch (error) {
    console.error("Error saving attractions:", error);
  }
}

module.exports = { getCityName, getAttractions, ReferenceToSrc };
