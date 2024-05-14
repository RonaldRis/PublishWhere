import mongoose, { Schema } from "mongoose";

export type IOauthPost = {
  provider: string;
  access_token?: string;
  expires_in?: Date;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
};

export type IOauth = {
  _id: string;
  provider: string;
  access_token: string;
  expires_in: Date;
  refresh_token: string;
  scope: string;
  token_type: string;
};

const oauthDataSchema: Schema = new Schema(
  {
    provider: { type: String, required: true },
    access_token: { type: String, required: true },
    expires_in: { type: Date, required: true },
    refresh_token: { type: String, required: true },
    scope: { type: String, required: true },
    token_type: { type: String, required: true },
  },
  { timestamps: true }
);

export { oauthDataSchema };
