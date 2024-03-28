import mongoose from "mongoose";
import assetSchema from "./asset.model";
import { marcaSchema } from "./marca.model";
import { IUser, userSchema } from "./user.model";
import { connectToDB } from "../mongoose";

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
const Marca = mongoose.models.Marca || mongoose.model("Marca", marcaSchema);
const Asset = mongoose.models.Asset || mongoose.model('Asset', assetSchema);

User.find({}).then((users) => {
    console.log("FIRST USERS: CALLING USERS MODEL FROM USER.MODEL.TS")
});

Marca.find({}).then((marcas) => {
    console.log("FIRST MARCAS: CALLING MARCAS MODEL FROM MARCA.MODEL.TS")
});

Asset.find({}).then((assets) => {
    console.log("FIRST ASSETS: CALLING ASSETS MODEL FROM ASSET.MODEL.TS")
});

connectToDB();



export { User, Marca, Asset};