import express from 'express'
import cors from 'cors'
import dns from 'dns'

dns.setServers(["1.1.1.1","8.8.8.8"])
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Server is live now!');
});

export default app;
