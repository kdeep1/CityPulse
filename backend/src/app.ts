import express from 'express';
import userRoutes from './routes/user.routes';
import e from 'express';
import { errorHandler } from './middlewares/err.middleware';    
import cookieParser from "cookie-parser";   
import authRoutes from "./auth/auth.routes"; 
import eventRoutes from './routes/event.routes';
import venueRoutes from "./routes/venue.routes";
const app = express();
app.use(express.json());
app.use('/api', userRoutes);
app.use("/api", eventRoutes);
app.use("/api", venueRoutes);
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.get('/',(req,res)=>{
    res.send("citypulse api running");
});


app.use(errorHandler);
export default app;