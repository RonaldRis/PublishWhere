import { Router } from 'express';
import passport from 'passport';
import axios from 'axios';
import qs from 'qs';
import TwitterStrategy from 'passport-twitter';
import dotenv from 'dotenv';
dotenv.config();

const TWITTER_API_KEY = process.env.TWITTER_API_KEY;
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET;
const TWITTER_API_CALLBACK = process.env.TWITTER_API_CALLBACK;
const CLIENT_URL = process.env.CLIENT_URL;

const routerTwitter = Router();

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_API_KEY,
    consumerSecret: TWITTER_API_SECRET,
    redirect_uri: TWITTER_API_CALLBACK,


},
    function (accessToken, refreshToken, profile, done) {
        const user = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            profile: profile
        };
        done(null, user);

    }
));

console.log("\n\n\n");


routerTwitter.get("/",
    passport.authenticate('twitter', {
        // <6> Scopes
        scope: ['tweet.read', "tweet.write", 'users.read', 'offline.access'],
    })
);
routerTwitter.get(
    '/callback',
    passport.authenticate('twitter'),
    async function (req, res) {



        var meUser = {};
        var resultThread = {}
        var postTweet = {};

        console.log("\n\n\nCALLBACK 1º")
        // console.log(req.user)


        //Tryout TWIITER API CLIENT 
        const { oauth_token, oauth_verifier } = req.query;

        req.user.oauth_token = oauth_token;
        req.user.oauth_verifier = oauth_verifier;

        const twitterData = {
            access_token: req.user.accessToken,
            refresh_token: req.user.refreshToken,
            provider: "twitter",
            scope: 'tweet.read,tweet.write,users.read,offline.access',
            token_type: 'oauth1',
            expires_in: new Date().getTime() + 1000 * 60 * 60 * 24 * 365*10 ,// 10 year - no expiration
            thumbnail: req.user.profile.photos[0].value,
            name: req.user.profile.displayName,
            username: req.user.profile.username,
            _idOnProvider: req.user.profile.id,
            urlPage: "https://twitter.com/" + req.user.profile.username,
            kind: "user",
        }

        
        const url = process.env.CLIENT_URL + "/perfil/marcas/callback-twitter?" + qs.stringify(twitterData);
        console.log("URL", url)
        res.redirect(url);


        // const accessToken = req.user.accessToken;
        // const refreshToken = req.user.refreshToken;
        // console.log("accessToken", accessToken)
        // console.log("refreshToken", refreshToken)

        // // User client
        // // var userClient = new TwitterClient("CONSUMER_KEY", "CONSUMER_SECRET", "ACCESS_TOKEN", "ACCESS_TOKEN_SECRET");


        // // OAuth 1.0a (User context)
        // const userClient = new TwitterApi({
        //     appKey: TWITTER_API_KEY,
        //     appSecret: TWITTER_API_SECRET,
        //     // Following access tokens are not required if you are
        //     // at part 1 of user-auth process (ask for a request token)
        //     // or if you want a app-only client (see below)
        //     accessToken: accessToken,
        //     accessSecret: refreshToken,
        // });



        // // meUser = await userClient.v2.me();
        // console.log("ME USER: ", meUser)



        // ////PASTE

        // const urlS3Image = "https://publishwhere-tfg.s3.eu-west-3.amazonaws.com/661c7505280e5f20ea7c9bd7df60e5761e21ca5d99bbfa85dc166f0b2490e48c64b5dbf272d8b3ecc3a29a5b.png"

        // // Download the image
        // const response = await axios({
        //     url: urlS3Image,
        //     method: 'GET',
        //     responseType: 'stream',
        // });

        // // Create a unique filename
        // const filename = `./tmp/${Date.now()}.png`;

        // // Write the image to a file
        // const writer = fs.createWriteStream(filename);
        // response.data.pipe(writer);

        // // Wait for the file to finish writing
        // await new Promise((resolve, reject) => {
        //     writer.on('finish', resolve);
        //     writer.on('error', reject);
        // });

        // const mediaId = await userClient.v1.uploadMedia(filename);
        // console.log(mediaId);

        // resultThread = await userClient.v2.tweetThread([
        //     "Prueba Thread",
        //     {
        //         text: "tweet con foto de AWS S3", media: { media_ids: [mediaId] }
        //     },
        //     "Works Fine"
        // ])

        // console.log("resultThread",resultThread);

        // // Delete the file
        // fs.unlink(filename,(error) =>{

        //     console.log("error", error);
        // });
        // // await fs.unlink(filename);


        // // ///FUNCIONA PERFECTO
        // // postTweet = await userClient.v2.tweet("Tweet made using oauth app token");
        // // console.log("postTweer", postTweet);


        // // postTweet = await userClient.tweets.createTweet({
        // //     text: "Post made using userContextClient tokens"
        // // })
        // // console.log("post tweet: ", postTweet);




        // res.json({
        //     result: req.user,
        //     me: meUser,
        //     tweet: postTweet,
        //     thread: resultThread
        // })
    }
);



const consumerKey = process.env.TWITTER_CONSUMER_KEY; //TWITTER_CONSUMER_KEY
const consumerSecret = process.env.TWITTER_CONSUMER_SECRET; //TWITTER_CONSUMER_SECRET

async function exchangeTokenForAccessToken(oauthToken, oauthVerifier) {
    const url = 'https://api.twitter.com/oauth/access_token';
    const auth = {
        username: TWITTER_API_KEY,// consumerKey,
        password: TWITTER_API_SECRET // consumerSecret
    };
    const params = {
        oauth_token: oauthToken,
        oauth_verifier: oauthVerifier
    };

    try {
        const response = await axios.post(url, qs.stringify(params), { auth });
        console.log('Access Token Details:', response.data);
        // Parse the response data as needed
        return qs.parse(response.data);
    } catch (error) {
        console.error('Failed to exchange tokens:', error.message);
        if (error.response) {
            console.error('Response details:', error.response.data);
        }
        return null;
    }
}


routerTwitter.get("/twitter/callback2", async function (req, res) {
    console.log("\n\n\nCALLBACK 2")


    const data = {
        client_id: process.env.TWITTER_API_KEY,
        client_secret: process.env.TWITTER_API_SECRET,
        redirect_uri: process.env.TWITTER_API_CALLBACK,
        grant_type: "authorization_code",
    };

    return res.json({
        headers: req.headers,
        body: req.body,
        data: data
    })


    var tokensDATA = null;
    await axios
        .post("https://oauth2.googleapis.com/token", qs.stringify(data), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
        .then((response) => {
            console.log("RESPONSE");
            console.log(response);
            console.log("\n\n\n");

            console.log(response.data);

            tokensDATA = response.data;
        })
        .catch((error) => {
            console.error(error);
        });

    tokensDATA.provider = "twitter";

    const page = "/perfil/marcas/callback-red-social?";
    res.json({ data: tokensDATA });
    // res.redirect(CLIENT_URL+page+qs.stringify(tokensDATA));


});

export {routerTwitter}