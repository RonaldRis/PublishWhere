require('dotenv').config();
const express = require("express");
const cors = require("cors");
const app = express();
const routerYoutube = require("./routes/youtubeV3Oauth");



app.use(
  express.urlencoded({ extended: true })
);
app.use(express.json());

// app.use(passport.initialize());
// app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.get("/auth", (req, res) => {
  res.json({message: "http://localhost:3001/auth/youtube"})
});
app.use("/auth", routerYoutube);


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Server is running! http://localhost:"+PORT);
});
