import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.model";

export interface ISocialMediaAccountPost {
  _idOnProvider: string;
  name: string;
  description?: string;
  provider: string;
  userCreator: string;
  oauthID: string;
  thumbnail: string;
  username: string;
  urlPage?: string;
  kind?: string;

}

export interface ISocialMediaAccount {
  _id: any;
  _idOnProvider: string;
  name: string;
  description?: string;
  provider: string;
  userCreator: string | IUser;
  oauthID: any;
  thumbnail: string;
  username: string;
  urlPage?: string;
  kind?: string;
}

const socialMediaAccountSchema: Schema = new Schema(
  {
    _idOnProvider: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    provider: { type: String, required: true },
    userCreator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    oauthID: { type: Schema.Types.ObjectId, ref: "Oauth"},
    marcaId: { type: Schema.Types.ObjectId, ref: "Marca" },
    thumbnail: { type: String, required: true },
    username: { type: String, required: true },
    urlPage: { type: String },
    kind: { type: String },
  },
  { timestamps: true }
);

export { socialMediaAccountSchema };
