const { getCityName, getAttractions } = require("../models/model");
const attractions = require("../models/model.mongo");

async function httpGetAllAttractions(req, res) {
  try {
    const { latitude, longitude } = req.body;

    console.log(`the coords are ${latitude} ${longitude}`);

    // the city name
    const cityName = await getCityName(latitude, longitude);
    console.log(cityName);

    const DATA = await attractions.find({ city: cityName });

    if (DATA.length > 0) {
      // send the data back to the client
      res.send(DATA);
    } else {
      //get the attractions follow by the city name
      const attractionsArray = await getAttractions(cityName);
      res.send(attractionsArray);
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = httpGetAllAttractions;
