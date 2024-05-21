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

      return city;
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

    const firstResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${city}+point+of+interest&language=he&key=${process.env.GOOGLE_KEY}&PageToken=${nextPageToken}`
    );

    const firstData = firstResponse.data;
    const firstResults = firstData.results;

    allResultsRow.push(...firstResults);
    totalResultsFetched += firstResults.length;

    if (!firstData.next_page_token || totalResultsFetched >= limit) {
      return allResultsRow.slice(0, limit);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    nextPageToken = firstData.next_page_token;
    const secondResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${city}+point+of+interest&language=he&key=${process.env.GOOGLE_KEY}&PageToken=${nextPageToken}`
    );

    const secondData = secondResponse.data;
    const secondResults = secondData.results;

    allResultsRow.push(...secondResults);
    totalResultsFetched += secondResults.length;
    console.log(allResultsRow);

    allResults = allResultsRow.map((obj) => ({
      city: city,
      name: obj.name,
      rating: obj.rating,
      address: obj.formatted_address,
      photoReference: obj.photos[0].photo_reference,
    }));

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
  const res = `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photoReference}&maxwidth=${width}&key=${process.env.GOOGLE_KEY}`;
  return res;
}

async function saveAttractions(data) {
  const bulkOps = data.map((obj) => ({
    updateOne: {
      filter: { name: obj.name }, // Assuming 'name' is unique
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
