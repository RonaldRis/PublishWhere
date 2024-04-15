
import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/MongoDb";


// Cargar variables de entorno desde .env.local
dotenv.config({ path: '.env.local' });
connectDatabase();

const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`CONTENT-UPLOAD-SERVICE`);
  console.log(`Server running on http://localhost:${port}`);
});
