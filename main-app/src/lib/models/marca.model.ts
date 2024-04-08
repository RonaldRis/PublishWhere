import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.model";
import { IFile } from "./file.model";

export interface IMarca {
    _id: string;
    name: string;
    admin: string | IUser;
    equipo: string[] | IUser[]; // References to other User documents
    files: string[] | IFile[]; // References to File documents
}

const marcaSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },

    admin: { type: Schema.Types.ObjectId, ref: 'User' },
    equipo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    files: [{ type: Schema.Types.ObjectId, ref: 'File' }],

},
    { timestamps: true }
);




export { marcaSchema }


