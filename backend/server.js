const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send("Hi");
});
app.use(cors({
  //origin: 'https://foodhubfront.netlify.app/',
}));
app.use(express.json());
app.use(express.static("public"));

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");
    
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

start();
app.use(require('./routes/userRoutes'));
app.use(require('./routes/resRoutes'));


app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
  });