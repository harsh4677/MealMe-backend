import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from "./routes/MyUserRoute";
import { v2 as cloudinary } from "cloudinary";
import myRestaurantRoute from "./routes/MyRestaurantRoute";
import restaurantRoute from "./routes/RestaurantRoute";
import orderRoute from "./routes/OrderRoute";
import dotenv from "dotenv";

dotenv.config();

// Check if the MongoDB connection string is defined
if (!process.env.MONGODB_CONNECTION_STRING) {
  throw new Error("MONGODB_CONNECTION_STRING is not defined");
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log("Connected to database!"))
  .catch((error) => {
    console.error("Error connecting to database:", error);
    process.exit(1);
  });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const app = express();

app.use(cors());
app.use(express.json());

// Define a route
app.get("/", (req: Request, res: Response): Response => {
  return res.status(200).json({
    status: "Success",
    message: "Route is working",
  });
});

app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));

app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myRestaurantRoute);
app.use("/api/restaurant", restaurantRoute);
app.use("/api/order", orderRoute);


app.get("/health", (req: Request, res: Response, next: NextFunction): Response => {
  return res.status(200).json({ message: "health OK!" });
});


const PORT = process.env.PORT || 8000;

// Start the server
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
