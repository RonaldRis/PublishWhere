import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  bio: String,
 
  onboarded: { //Pide que llene o confirme la información de su perfil
    type: Boolean,
    default: false,
  },
   
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
