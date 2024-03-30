import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.model";

mongoose.connect(process.env.MONGO_URL!);
mongoose.Promise = global.Promise;

export interface IMarca {
    _id: string;
    name: string;
    admin: string | IUser;
    equipo: string[] | IUser[]; // References to other User documents
}

const marcaSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },

    admin: { type: Schema.Types.ObjectId, ref: 'User' },
    equipo: [{ type: Schema.Types.ObjectId, ref: 'User' }],
},
    { timestamps: true }
);




export { marcaSchema }


