import express, { Request, Response } from 'express';
import 'dotenv/config'; // Load environment variables from .env file
import {connectToDatabase} from "shared-lib"
import cors from "cors";
import { routerPublish } from './publish/routerPublish';


connectToDatabase(process.env.MONGODB_URL!);

const app = express();
app.use(cors())
app.use(express.json());
const port = process.env.PORT || 3003; // Use environment variables

// Define a simple route for the root path ('/')
app.get('/', (req: Request, res: Response) => {
  console.log("UPLOAD BACKEND: ", req.url);
  res.send('Content Upload Service! PORT: '+process.env.PORT);
});

app.use("/publish", routerPublish);

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
