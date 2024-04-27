import mongoose from "mongoose";
import { IMarca, marcaSchema } from "./marca.model";
import { IUser, userSchema } from "./user.model";
import { IFile, fileSchema } from "./file.model";
import { IOauth, oauthDataSchema } from "./Oauth.model";
import { ISocialMediaAccount, socialMediaAccountSchema } from "./socialMediaAccount.model";

mongoose.connect(process.env.MONGODB_URL!);
mongoose.Promise = global.Promise;


const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
const Marca = mongoose.models.Marca || mongoose.model<IMarca>("Marca", marcaSchema);
const File = mongoose.models.File || mongoose.model<IFile>("File", fileSchema);
const Oauth = mongoose.models.Oauth || mongoose.model<IOauth>("Oauth", oauthDataSchema);
const SocialMediaAccount = mongoose.models.SocialMediaAccount 
                        || mongoose.model<ISocialMediaAccount>("SocialMediaAccount", socialMediaAccountSchema);

//BORRAR
// User.find({}).then((users) => {
//     console.log("FIRST USERS: CALLING USERS MODEL FROM USER.MODEL.TS")
// });

// Marca.find({}).then((marcas) => {
//     console.log("FIRST MARCAS: CALLING MARCAS MODEL FROM MARCA.MODEL.TS")
// });

// Asset.find({}).then((assets) => {
//     console.log("FIRST ASSETS: CALLING ASSETS MODEL FROM ASSET.MODEL.TS")
// });


//DEJAR
// connectToDB();



export { User, Marca, File, Oauth, SocialMediaAccount   };