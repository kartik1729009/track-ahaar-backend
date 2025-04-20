import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { dbConnect } from './config/dbconnect';
import authRoutes from './routes/routes';
import cookieParser from 'cookie-parser'; // Add this for cookie handling

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

dbConnect();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});


app.get('/', (req, res) => {
  res.send("Track-Ahaar API is running");
});

app.use("/api/auth", authRoutes);


app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


app.listen(PORT, () => {
  console.log(`Server is running successfully on PORT: ${PORT}`);
});