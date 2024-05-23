import { Oauth } from "shared-lib";

async function refreshAccessToken(refresh_token: string) {

  const response = await fetch('https://oauth2.googleapis.com/token', {
    body: `client_id=${process.env.YOUTUBE_API_KEY}&client_secret=${process.env.YOUTUBE_API_SECRET}&refresh_token=${refresh_token}&grant_type=refresh_token`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
  })
  const data = await response.json()
  return data
}


const cronUpdateYoutubeTokens = async () => {
  console.log("cronUpdateYoutubeTokens: " + new Date());

  try {
    const allOauth = await Oauth.find({ provider: "youtube" });
    console.log("# youtube: ", allOauth.length);
    console.log("HORA ACTUAL: ", new Date());
    for (const oauthYoutubeChannel of allOauth) {

      const newAccessToken = await refreshAccessToken(oauthYoutubeChannel.refresh_token);
      console.log("newAccessToken", newAccessToken);
      if (newAccessToken) {
        var oneHourLater = new Date();
        oneHourLater.setHours(oneHourLater.getHours() + 1);
        oneHourLater.setHours(oneHourLater.getMinutes() - 5);
        console.log("oneHourLater", oneHourLater);
        const responseUpdate = await Oauth.updateOne({ _id: oauthYoutubeChannel._id }, { $set: { accessToken: newAccessToken.access_token, expires_in: oneHourLater } });
        console.log("responseUpdate", responseUpdate);
      }
    }
    // allOauth.forEach(async (oauthYoutubeChannel) => {
    //   console.log("HORA ACTUAL: ", new Date());

    //   const newAccessToken = await refreshAccessToken(oauthYoutubeChannel.refresh_token);
    //   if (newAccessToken) {
    //     var oneHourLater = new Date();
    //     oneHourLater.setHours(oneHourLater.getHours() + 1);
    //     console.log("oneHourLater", oneHourLater);
    //     await Oauth.updateOne({ _id: oauthYoutubeChannel._id }, { $set: { accessToken: newAccessToken.access_token, expires_in: oneHourLater } });
    //   }
    // });
  } catch (err) {
    console.error(err);
  }
}

export { cronUpdateYoutubeTokens }