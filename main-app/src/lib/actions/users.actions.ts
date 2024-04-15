"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";


import { connectToDB } from "../mongoose";
import { User } from "../models/models";
import { IUser } from "../models/user.model";
import { IServerResponse } from "./ServerResponse";

export async function fetchUserAction(userId: string) : Promise<IServerResponse<IUser>>{
  try {
    // connectToDB();

    const queryReuslt =  await User.findOne({ id: userId })
    const user =  JSON.parse(JSON.stringify(queryReuslt)) as IUser;
    return { data: user, isOk: true, message: null };


  } catch (error: any) {
    return { data: null, isOk: false, message: "No hay usuario" };
  }
}


export async function fetchAllUserAction() : Promise<IServerResponse<IUser[]>>{
  try {

    const queryReuslt =  await User.find({})
    const user =  JSON.parse(JSON.stringify(queryReuslt)) as IUser[];
    return { data: user, isOk: true, message: null };


  } catch (error: any) {
    return { data: [], isOk: false, message: "No hay usuarios" };
  }
}

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUserAction({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    // connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}
