import { coordsToData } from "./requests.js";
import { renderTheCorrentObject } from "./model.client.js";

const button = document.querySelector(".button");
let page = 0;

navigator.geolocation.getCurrentPosition(success, error);

async function success(position) {
  try {
    // Get the coordinates
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Get the data
    const dataArray = await coordsToData(latitude, longitude);

    // Remove duplicate objects
    const uniqueDataArray = dataArray.filter(
      (obj, index, array) =>
        array.findIndex((item) => item.name === obj.name) === index
    );

    // Use the new object
    const dataObject = uniqueDataArray[page];

    // Render the current object
    await renderTheCorrentObject(dataObject);
    page++;

    // Render by the button click
    button.addEventListener("click", function () {
      // Check if page is not bigger than the array
      if (page === uniqueDataArray.length - 1) {
        page = 0;
      }
      page++;
      renderTheCorrentObject(uniqueDataArray[page]);
      console.log(page);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

function error(err) {
  console.log(err);
}
