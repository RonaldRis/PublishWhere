// src/index.ts
import mongoose from "mongoose";
import { IMarca, marcaSchema } from "./models/marca.model";
import { IUser, userSchema } from "./models/user.model";
import { IFile, fileSchema } from "./models/file.model";
import { IOauth, oauthDataSchema } from "./models/Oauth.model";
import { ISocialMediaAccount, socialMediaAccountSchema } from "./models/socialMediaAccount.model";
import { IPublication, publicationDataSchema } from "./models/publicaction.model";

mongoose.Promise = global.Promise;

let isConnected = false;

export const connectToDatabase = async (mongoUri: string) => {
    if (isConnected) return;

    try {
        await mongoose.connect(mongoUri);
        isConnected = true;
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error('Database connection error');
    }
};

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
const Marca = mongoose.models.Marca || mongoose.model<IMarca>("Marca", marcaSchema);
const File = mongoose.models.File || mongoose.model<IFile>("File", fileSchema);
const Oauth = mongoose.models.Oauth || mongoose.model<IOauth>("Oauth", oauthDataSchema);
const SocialMediaAccount = mongoose.models.SocialMediaAccount
    || mongoose.model<ISocialMediaAccount>("SocialMediaAccount", socialMediaAccountSchema);
const Publication = mongoose.models.Publication || mongoose.model<IPublication>("Publication", publicationDataSchema);



export interface IServerResponse<T> {
    data: T | null;
    isOk: boolean;
    message: string | null;
}

export const createResponse = (isOk: Boolean, message: string, data: any) => {

    return {
        data: data,
        isOk: isOk,
        message: message
    }
}




export { User, Marca, File, Oauth, SocialMediaAccount, Publication, isConnected };
