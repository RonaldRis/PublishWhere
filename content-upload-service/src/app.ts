import express, { Request, Response } from 'express';
import 'dotenv/config'; // Load environment variables from .env file
import {connectToDatabase} from "shared-lib"

import { routerPublish } from './publish/routerPublish';


connectToDatabase(process.env.MONGODB_URL!);

const app = express();
const port = process.env.PORT || 3004; // Use environment variables

// Define a simple route for the root path ('/')
app.get('/', (req: Request, res: Response) => {
  res.send('Content Upload Service!');
});

app.use("/publish", routerPublish);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
