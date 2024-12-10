import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './db/connectDB.js';
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import orderRoutes from './routes/order.route.js';
import cookieParser from 'cookie-parser';
import cors from "cors";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:5173", // Dev
  "https://echobazar-ecommerce.vercel.app", // Prod
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use("/api/auth", authRoutes);
app.use('/api', productRoutes);
app.use('/api/create', orderRoutes);


app.listen(PORT, () => {
    connectDB();
    console.log("listening on port: ", PORT);
});