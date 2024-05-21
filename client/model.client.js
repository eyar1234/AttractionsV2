const button = document.querySelector(".button");
import { srcOfImage } from "./requests.js";

async function renderTheCorrentObject(dataArray, page) {
  // Ensure page is within the bounds of dataArray
  if (page < 0 || page >= dataArray.length) {
    console.error("Page index out of bounds");
    return;
  }

  // Get the data for the current page
  let data = dataArray[page];
  console.log(data);

  // Get the image source
  let src = await srcOfImage(data.photoReference);
  // console.log(src);

  // Create the HTML
  const html = `
    <article class="attraction">
      <img class="img" src="${src}" />
      <div class="data">
        <h3 class="name">${data.name}</h3>
        <h4 class="address">${data.address}</h4>
        <p class="attraction__row">
          <span>${"⭐️".repeat(Math.floor(data.rating))}</span>${data.rating}
        </p>
      </div>
    </article>
  `;

  // Render the HTML
  const attractionContainer = document.querySelector(".attraction-container");
  if (page === 0) {
    attractionContainer.innerHTML = html;
    button.style.opacity = 1;
  } else {
    attractionContainer.innerHTML = html;
  }
}

export { renderTheCorrentObject };
