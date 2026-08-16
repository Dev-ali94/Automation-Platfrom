import express from 'express'
import cookieParser from "cookie-parser";
import authRoute from "../src/routes/authRoute.js"
import userRoute from "../src/routes/userAuth.js"
import socialAccountRoute from "../src/routes/socialAuthRoute.js"
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
app.use('/api/user', userRoute);
app.use('/api/social-auth', socialAccountRoute);
app.get('/', (req, res) => {
  res.send('Server is live now!');
});

export default app;
