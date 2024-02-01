const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Product = require("./models/product");
require("dotenv/config");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { explorer: true })
);

app.use(bodyParser.json());
const api = process.env.API_URL;

mongoose
  .connect(process.env.CONNECTION_STRING, {
    dbName: "eshop-database",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

const server = app.listen(3000, () =>
  console.log("server is running on the 3000 port")
);

// Create a new product
app.post(`${api}/products`, async (req, res) => {
  try {
    console.log("entered here");
    const { name, description, price, variants } = req.body;
    console.log(req.body);
    const product = await Product.create({
      name,
      description,
      price,
      variants,
    });
    console.log("2");
    res.status(201).json(product);
    //console.log(req.body);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
});

app.get(`${api}/products/search`, async (req, res) => {
  try {
    const { query } = req.query;
    // Search products by name, description, or variant name using a regular expression
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // Case-insensitive search for product name
        { description: { $regex: query, $options: "i" } }, // Case-insensitive search for description
        { "variants.name": { $regex: query, $options: "i" } }, // Case-insensitive search for variant name
      ],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get all products
app.get(`${api}/products`, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single product by ID
app.get(`${api}/products/:id`, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a product by ID
app.put(`${api}/products/:id`, async (req, res) => {
  try {
    const { name, description, price, variants } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, variants },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a product by ID
app.delete(`${api}/products/:id`, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// afterAll(() => {
//   server.close();
// });

module.exports = app;
