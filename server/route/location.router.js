const express = require("express");
const httpGetAllAttractions = require("./location.controller.js");
const locationRouter = express.Router();

locationRouter.post("/location", httpGetAllAttractions);

module.exports = locationRouter;
