import 'dotenv/config'; // Load environment variables from .env file


import cron from 'node-cron';
import express from 'express';
import { cronCheckPublishContent } from './cron/cronCheckPublishContent';
import { cronUpdateYoutubeTokens } from './cron/cronUpdateYoutubeTokens';
import {connectToDatabase} from "shared-lib";

//Connecto la base de datos

connectToDatabase(process.env.MONGODB_URL!);
//Espera a que se conecte a la base de datos
setTimeout(() => {
  console.log("Conectado a la base de datos...");
}, 3000);
const app = express();
const port = process.env.PORT || 3002; // Use environment variables

// Define a simple route for the root path ('/')
app.get('/', (req, res) => {
  res.send('Cron Service Backend!');
});

cron.schedule('*/20 * * * *', cronUpdateYoutubeTokens); //Every 20 minutes
cron.schedule('*    * * * *', cronCheckPublishContent); //Every minute


// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
