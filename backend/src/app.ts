import express from 'express';
import userRouter from './routes/user.routes';
const app = express();
app.use(express.json());
app.use('/api', userRouter);

app.get('/',(req,res)=>{
    res.send("citypulse api running");
});
export default app;