import mongoose, { Document, Schema } from "mongoose";

// 👇 Define the TypeScript interface for a user
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  contactNo?: string; // ✅ optional new field
}

// 👇 Define the schema
const signUpSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    default: "",
  },
});


const SignUp = mongoose.model<IUser>("SignUp", signUpSchema);

export default SignUp;
