import app from "./src/app.js"
import connectDB from "./src/config/db.js"
import dotenv from 'dotenv'

const port = process.env.PORT || 3000;
dotenv.config()
connectDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});
