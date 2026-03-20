import express from 'express';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middlewares/err.middleware';    
import cookieParser from "cookie-parser";   
import authRoutes from "./auth/auth.routes"; 
import eventRoutes from './routes/event.routes';
import venueRoutes from "./routes/venue.routes";
import bookingRoutes from './routes/booking.routes';
import seatRoutes from './routes/seat.routes';
import reviewRoutes from './routes/review.routes';
import favoriteRoutes from './routes/favorite.routes';
import ticketRoutes from './routes/ticket.routes';

const app = express();
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use('/api', userRoutes);
app.use("/api", eventRoutes);
app.use("/api", venueRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api", seatRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api", favoriteRoutes);
app.use("/api/tickets", ticketRoutes);

app.get('/',(req,res)=>{
    res.send("citypulse api running");
});


app.use(errorHandler);
export default app;