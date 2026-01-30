import express from "express";
import cors from "cors";
import authRoutes from "./routes/authroutes.js";
import mailRoutes from "./routes/mailroutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bulk Mailer Backend is running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/mail", mailRoutes);

export default app;