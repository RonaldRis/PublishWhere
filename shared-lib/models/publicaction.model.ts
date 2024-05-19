import mongoose, { Schema } from "mongoose";
import { IFile } from "./file.model";
import { IUser } from "./user.model";
import { ISocialMediaAccount } from "./socialMediaAccount.model";
import { IMarca } from "./marca.model";

export interface IPublicationPost {
    title: string,
    creatorId: string,
    files: string[],
    marcaId: string,
    alreadyPosted: boolean,
    isSchedule: boolean,
    programmedDate: Date,
    programmedTime: Date,
    isPostingInProgress: boolean,
    socialMedia: {
        provider: string,
        idPublicacionOnProvider: string,
        urlPost: string,
        socialMedia: string
    }[]

};

export interface IPublication {
    _id: any;
    createdAt: Date;
    updatedAt: Date;


    ///COMMONS
    title: string,
    creatorId: IUser,
    files: IFile[],
    marcaId: IMarca,
    alreadyPosted: boolean,
    isSchedule: boolean,
    programmedDate: Date,
    programmedTime: Date,
    isPostingInProgress: boolean,
    socialMedia: {
        provider: string,
        idPublicacionOnProvider: string,
        urlPost: string,
        socialMedia: ISocialMediaAccount
    }[]

};

const publicationDataSchema: Schema = new Schema(
    {
        title: { type: String, required: false },

        creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        files: [{ type: Schema.Types.ObjectId, ref: 'File' }],
        marcaId: { type: Schema.Types.ObjectId, ref: 'Marca' },
        alreadyPosted: { type: Boolean, default: false },
        isSchedule: { type: Boolean, default: false },
        programmedDate: { type: Date, default: new Date() },
        programmedTime: { type: Date, default: new Date() }, //MAYBE
        isPostingInProgress: { type: Boolean, default: false },

        socialMedia: [{
            provider: { type: String, required: true },
            idPublicacionOnProvider: { type: String, required: false },
            urlPost: { type: String, required: false },
            socialMedia: { type: Schema.Types.ObjectId, ref: 'SocialMediaAccount', required: true },
        }]


    },
    { timestamps: true }
);

export { publicationDataSchema };
