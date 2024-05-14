import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import dotenv from 'dotenv';
import { connectDatabase } from './lib/MongoDb.js';
import {routes} from './routes/routes.js';
import cron from 'node-cron';
import { cronUpdateYoutubeTokens } from '../cron-job-service/src/cron/cronCheckPublishContent.js';


dotenv.config();
connectDatabase();
const app = express();




app.use(cookieParser())
app.use(
  express.urlencoded({ extended: true })
);
app.use(express.json());

app.use(
  session({ secret: 'minami no shima wa', resave: false, saveUninitialized: true })
)
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});




app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);


routes(app);

///CRON JOBS
cron.schedule('*/20 * * * *', cronUpdateYoutubeTokens);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server is running! http://localhost:" + PORT);
});
