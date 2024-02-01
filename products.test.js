const request = require("supertest");
const app = require("./app");

const Product = require("./models/product");

describe("Product Model Tests", () => {
  it("should create and retrieve a product", async () => {
    const productData = {
      name: "Test Product",
      description: "Test Description",
      price: 10.99,
      variants: [
        { name: "Variant 1", SKU: "SKU-1", additionalCost: 5, stockCount: 100 },
      ],
    };

    const product = await Product.create(productData);

    const retrievedProduct = await Product.findById(product._id);
    await request(app).delete(`/api/v1/products/${retrievedProduct._id}`);
    expect(retrievedProduct.name).toBe(productData.name);
    expect(retrievedProduct.description).toBe(productData.description);
    expect(retrievedProduct.price).toBe(productData.price);
    expect(retrievedProduct.variants.length).toBe(productData.variants.length);
  });
});

describe("API Endpoint Tests", () => {
  let productId;
  it("should create a product", async () => {
    const productData = {
      name: "Test Product",
      description: "Test Description",
      price: 10.99,
      variants: [
        { name: "Variant 1", SKU: "SKU-1", additionalCost: 5, stockCount: 100 },
      ],
    };

    const response = await request(app)
      .post("/api/v1/products")
      .send(productData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("_id");
    productId = response.body._id;
  });

  it("should retrieve all products", async () => {
    const response = await request(app).get("/api/v1/products");
    expect(response.status).toBe(200);
  });

  it("should retrieve a product by ID", async () => {
    const response = await request(app).get(`/api/v1/products/${productId}`);
    expect(response.status).toBe(200);
  });

  it("should update a product by ID", async () => {
    const updatedProductData = {
      name: "Updated Test Product",
      description: "Updated Test Description",
      price: 15.99,
      variants: [
        {
          name: "Updated Variant",
          SKU: "UPDATEDSKU",
          additionalCost: 7.99,
          stockCount: 150,
        },
      ],
    };

    const response = await request(app)
      .put(`/api/v1/products/${productId}`)
      .send(updatedProductData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", productId);
  });

  it("should delete a product by ID", async () => {
    const response = await request(app).delete(`/api/v1/products/${productId}`);

    expect(response.status).toBe(200);
  });
});

describe("Search Functionality Tests", () => {
  it("should search products by name, description, or variant name", async () => {
    const response = await request(app)
      .get("/api/v1/products/search")
      .query({ query: "test" });

    expect(response.status).toBe(200);
  });
});
