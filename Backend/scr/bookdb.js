const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    ISBN: {
      type: String,
      required: true,
      unique:true,
    },
    Author: {
      type: String,
      required: true,
    },
    Title: {
      type: String,
      required: true,
    },
    Review: [{
        email: String, 
        comment: String,
    }],
  },
  { timestamps: true }
);

const collection = new mongoose.model('Book',BookSchema)

module.exports = collection;