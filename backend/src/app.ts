import express from 'express';
import userRoutes from './routes/user.routes';
import e from 'express';
import { errorHandler } from './middlewares/err.middleware';        
const app = express();
app.use(express.json());
app.use('/api', userRoutes);

app.get('/',(req,res)=>{
    res.send("citypulse api running");
});


app.use(errorHandler);
export default app;