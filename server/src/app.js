import express from 'express'
import cookieParser from "cookie-parser";
import authRoute from "../src/routes/authRoute.js"
import socialAccountRoute from "../src/routes/socialAuthRoute.js"
import accountRoutes from "../src/routes/accountRoutes.js"
import generationRoutes from "../src/routes/generationRoutes.js"
import postRoutes from "../src/routes/postRoute.js"
import activityRoutes from "../src/routes/ActivityLogRoute.js"
import initSchedular from "../src/services/SchedularServices.js"
import cors from 'cors'
import dns from 'dns'

dns.setServers(["1.1.1.1","8.8.8.8"])
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true                 
}));

app.use('/api/auth', authRoute);
app.use('/api/social-auth', socialAccountRoute);
app.use('/api/account', accountRoutes);
app.use('/api/generation', generationRoutes);
app.use('/api/post', postRoutes);
app.use('/api/activity', activityRoutes);
initSchedular()
app.get('/', (req, res) => {
  res.send('Server is live now!');
});

export default app;
