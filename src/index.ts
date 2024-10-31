import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import router from "./routes/authRoutes";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);
app.listen(PORT, () => {
  console.log(`Database connected successfully on http://localhost:${PORT}`);
});
