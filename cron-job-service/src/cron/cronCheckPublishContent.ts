import axios from "axios";
import { Publication } from "shared-lib";
import { IPublication } from "shared-lib/models/publicaction.model";



const cronCheckPublishContent = async () => {
    console.log("cronCheckPublishContent: " + new Date());

    try {

        // const result = await Publication.find({ programmedDate: { $lte: new Date() }, published: false });
        const result = await Publication.find({ programmedDate: { $lte: new Date() } });
        const publicaciones = JSON.parse(JSON.stringify(result)) as IPublication[];
        console.log("# publicaciones: ", publicaciones.length);

        for (let i = 0; i < publicaciones.length; i++) {
            console.log("\n\npublicaciones["+i+"]", publicaciones[i]);
            if (publicaciones[i].alreadyPosted == false && publicaciones[i].isPostingInProgress === false) {

                try {

                    //Prevent multiple posts
                    await Publication.updateOne({ _id: publicaciones[i]._id }, { $set: { isPostingInProgress: true } });
                    console.log("\n//Start Posting proccess: " + publicaciones[i]._id + " " + publicaciones[i].title)
                    //Start Posting proccess
                    const result = await fetch(process.env.CLIENT_URL + "/api/post-content?id="+publicaciones[i]._id, {
                        method: "GET",
                    });
                    const data = await result.json();
                    console.log("data", data);
                    if (data.status === 200) {
                        await Publication.updateOne({ _id: publicaciones[i]._id }, { $set: { alreadyPosted: true, isPostingInProgress: false } });
                    } else {
                        await Publication.updateOne({ _id: publicaciones[i]._id }, { $set: { isPostingInProgress: false } });
                    }
                } catch (err) {
                    console.error(err);
                    await Publication.updateOne({ _id: publicaciones[i]._id }, { $set: { isPostingInProgress: false } });
                }
            }
        }

    } catch (err) {
        console.error(err);
    }
}

export { cronCheckPublishContent }