import React from "react";
import "./card.style.css";
import icons from "../img/icons.svg";
function Card({ data, clickHandler, opositeClickHandler }) {
  if (!data || !data.name) {
    return (
      <div className="spinnerContainer">
        <div className="spinner">
          <svg>
            <use href={`${icons}#icon-loader`}></use>
          </svg>
        </div>
      </div>
    ); // Handle case where name is undefined or null
  }
  console.log(data.src);

  return (
    <div className="attractions">
      <img className="img" src={data.src} alt={data.name} />
      <div className="data">
        <h3 className="name">{data.name}</h3>
        <h4 className="address">{data.address}</h4>
        <p className="star">
          <span>{"⭐️".repeat(Math.floor(data.rating))}</span>
          {data.rating}
        </p>
        <div className="buttons">
          <button onClick={opositeClickHandler} className="button">
            חזרה
          </button>
          <button onClick={clickHandler} className="button">
            הבא
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
