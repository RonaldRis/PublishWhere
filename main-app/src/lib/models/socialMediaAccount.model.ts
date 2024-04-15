import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.model";
import { IFile } from "./file.model";
import { IOauth } from "./Oauth.model";

export interface ISocialMediaAccountPost {
  _idOnProvider: string;
  name: string;
  description?: string;
  provider: string;
  userCreator: string;
  oauth: string;
  thumbnail: string;
  username: string;
  urlPage?: string;
  kind?: string;

}

export interface ISocialMediaAccount {
  _id: string;
  _idOnProvider: string;
  name: string;
  description?: string;
  provider: string;
  userCreator: string | IUser;
  oauth: string[] | IOauth[];
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
    oauth: { type: Schema.Types.ObjectId, ref: "Oauth", required: true },
    thumbnail: { type: String, required: true },
    username: { type: String, required: true },
    urlPage: { type: String },
    kind: { type: String },
  },
  { timestamps: true }
);

export { socialMediaAccountSchema };
