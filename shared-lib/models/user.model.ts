import mongoose, { Schema } from "mongoose";
import { IMarca } from "./marca.model";


export interface IUser {
  _id: string;
  email: string;
  name: string;
  image: string;
  bio: string;
  onboarded: boolean;
}


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: false },
  bio: String,
  onboarded: { //Pide que llene o confirme la información de su perfil
    type: Boolean,
    default: false,
  },

  favoriteFiles: [{
    fileId: { type: Schema.Types.ObjectId, ref: 'File' },
    brandId: { type: Schema.Types.ObjectId, ref: 'Marca' },
  }],

});



export { userSchema };

