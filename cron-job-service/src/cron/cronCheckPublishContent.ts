import axios from "axios";
import { Publication } from "shared-lib";
import { IPublication } from "shared-lib/models/publicaction.model";



const cronCheckPublishContent = async () => {
    console.log("\n\n\n\ncronCheckPublishContent: " + new Date());

    try {

        // const result = await Publication.find({ programmedDate: { $lte: new Date() }, published: false });
        const result = await Publication.find({ programmedDate: { $lte: new Date() }, alreadyPosted: false });
        const publicaciones = JSON.parse(JSON.stringify(result)) as IPublication[];
        //Valido las fechas
        console.log("# publicaciones: ", publicaciones.length);
        const publicacionesValidas: IPublication[] = publicaciones.filter((pub) => {
            const programmedTime = new Date(pub.programmedTime);
            return programmedTime.getUTCDate() <= new Date().getUTCDate();
        });

        console.log("# publicaciones VALIDAS: ", publicacionesValidas.length);

        for (let i = 0; i < publicacionesValidas.length; i++) {
            console.log("\n\npublicaciones[" + i + "]");
            // console.log("\n\npublicaciones[" + i + "]", publicacionesValidas[i]);
            if (publicacionesValidas[i].alreadyPosted == false && publicacionesValidas[i].isPostingInProgress === false) {

                try {

                    const url = process.env.CLIENT_URL + "/api/post-content?id=" + publicacionesValidas[i]._id;
                    console.log("url", url);
                    
                    //Prevent multiple posts
                    await Publication.updateOne({ _id: publicacionesValidas[i]._id }, { $set: { isPostingInProgress: true } });
                    console.log("\n//Start Posting proccess: " + publicacionesValidas[i]._id + " " + publicacionesValidas[i].title)
                    //Start Posting proccess - Dont wait - just start the process
                    
                    await fetch(url, {
                        method: "GET",
                    });

                } catch (err) {
                    console.error(err);
                    await Publication.updateOne({ _id: publicacionesValidas[i]._id }, { $set: { isPostingInProgress: false } });
                }
            }
        }

    } catch (err) {
        console.error(err);
    }
}

export { cronCheckPublishContent }