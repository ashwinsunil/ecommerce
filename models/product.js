const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  variants: [
    {
      name: String,
      SKU: String,
      additionalCost: Number,
      stockCount: Number,
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
