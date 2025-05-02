import "../utils/config.js";
import Product from "../models/product.models.js";
import connectDb from "../db/db.js";
import mongoose from "mongoose";

const seedProducts = async () => {
  const products = [
    {
      name: "Herbs",
      description: "Description for Product 1",
      price: 100,
      quantity: 10,
      image_url:
        "https://res.cloudinary.com/dmbkzc6yo/image/upload/v1697096029/iip1zkeyifs57auv3rqo.jpg",
    },
    {
      name: "Watch",
      description: "Description for Product 2",
      price: 200,
      quantity: 10,
      image_url:
        "https://res.cloudinary.com/dmbkzc6yo/image/upload/v1697172322/zvhpze1t75nrrdh1fswh.jpg",
    },
    {
      name: "Ketchup",
      description: "Description for Product 3",
      price: 300,
      quantity: 10,
      image_url:
        "https://res.cloudinary.com/dmbkzc6yo/image/upload/v1697174546/sh6wzj0tsib4jydgnp5n.png",
    },
  ];

  try {
    connectDb();
    await Product.insertMany(products);
    console.log("Products seeded successfully");
  } catch (error) {
    mongoose.disconnect();
    console.error("Error seeding products:", error);
  } finally {
    mongoose.disconnect();
    process.exit(0);
  }
};

seedProducts();
