import { coordsToData } from "./requests.js";
import { renderTheCorrentObject } from "./model.client.js";

const button = document.querySelector(".button");
let page = 0;

navigator.geolocation.getCurrentPosition(success, error);

async function success(position) {
  // get the coordinates
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  // get the data
  const dataArray = await coordsToData(latitude, longitude);

  console.log(dataArray);

  // render the first object
  // await renderTheCorrentObject(dataArray, page);

  // // render on button click
  // button.addEventListener("click", async function () {
  //   page = (page + 1) % dataArray.length; // cycle through the data
  //   await renderTheCorrentObject(dataArray, page);
  //   console.log(page);
  // });
}

function error(err) {
  console.log(err);
}
