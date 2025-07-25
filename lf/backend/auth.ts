import mongoose from "mongoose";
const signUpSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
const SignUp = mongoose.model("SignUp", signUpSchema);
export default SignUp;
