// import mongoose from "mongoose";
// import bcrypt from "bcrypt";

// const SALT_ROUNDS = 6;

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, unique: true, trim: true, lowercase: true, required: true },
//     password: { type: String, required: true }
//   },
//   {
//     timestamps: true,
//     toJSON: {
//       transform(doc, ret) {
//         delete ret.password;
//         return ret;
//       }
//     }
//   }
// );

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
//   next();
// });

// const User = mongoose.model("User", userSchema);
// export default User;

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Profile fields
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    avatar: { type: String, default: "" }, // optional profile pic

    // Social connections
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare entered password with hashed one
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// const User = mongoose.model("User", userSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
