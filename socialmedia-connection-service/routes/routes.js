import { routerAuth } from "./auth/routerAuth.js";
import { routerPublish } from "./publish/routerPublish.js";

function routes(app) {
    app.get("/", (req, res) => {
        res.json({
            status: "Ok", mainApp: "https://publishwhere.com", newAccount: {
                youtube: "https://auth.publishwhere.com/auth/youtube",
                tiktok: "https://auth.publishwhere.com/auth/tiktok",
                twitter: "https://auth.publishwhere.com/auth/twitter",
            }
        })
    })


    // ROUTES
    app.use("/auth", routerAuth);
    app.use("/publish", routerPublish)


}
export  {routes};