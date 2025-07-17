import mongoose from "mongoose";
const signUpSchema = new mongoose.Schema({
  signName: {
    type: String,
    required: true,
  },
  signEmail: {
    type: String,
    required: true,
  },
  signPass: {
    type: String,
    required: true,
  },
});
const SignUp = mongoose.model("SignUp", signUpSchema);
export default SignUp;
