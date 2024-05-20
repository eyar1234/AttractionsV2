const { getTheName, getTheAttractions } = require("../models/model");

async function locationData(req, res) {
  const { latitude, longitude } = req.body;

  console.log(`the coords are ${latitude} ${longitude}`);
  // the city name
  const cityName = await getTheName(latitude, longitude);
  console.log(cityName);

  //get the attractions follow by the city name
  const attractionsArray = await getTheAttractions(cityName);

  // send the data back to the client
  res.send(attractionsArray);
}

module.exports = locationData;
