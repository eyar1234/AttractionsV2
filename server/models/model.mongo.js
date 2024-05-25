const mongoose = require("mongoose");

const attractionSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  photoReference: {
    type: String,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("attraction", attractionSchema);
