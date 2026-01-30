import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { sequelize } from "./models/index.js";
import "./utils/emailCron.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  await sequelize.sync({ alter: true }); // auto create tables
  console.log("📦 Database synced");

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();