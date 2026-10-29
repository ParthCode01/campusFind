const mongoose = require("mongoose");

const categories = [
  "Electronics",
  "Documents / ID Cards",
  "Bags",
  "Accessories",
  "Books / Stationery",
  "Keys",
  "Other",
];

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: categories,
    },
    type: {
      type: String,
      required: true,
      enum: ["Lost", "Found"],
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    contactName: {
      type: String,
      required: true,
      trim: true,
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ["Open", "Resolved"],
      default: "Open",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Item", itemSchema);
