
// import mongoose from "mongoose";
// import bcrypt from "bcrypt";

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },

//     // Profile fields
//     firstName: { type: String, default: "" },
//     lastName: { type: String, default: "" },
//     bio: { type: String, default: "" },
//     occupation: { type: String, default: "" },
//     education: { type: String, default: "" },
//     canHelpWith: [{ type: String }],
//     needHelpWith: [{ type: String }],
//     location: { type: String, default: "" },
//     avatar: { type: String, default: "/default-avatar.png" }, // optional profile pic

//     // Social connections
//     friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//     createdAt: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// // Hash password before saving
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// // Compare entered password with hashed one
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return bcrypt.compare(enteredPassword, this.password);
// };

// // const User = mongoose.model("User", userSchema);
// const User = mongoose.models.User || mongoose.model("User", userSchema);
// export default User;

import mongoose from "mongoose";
// import bcrypt from "bcrypt";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // 🔐 Password reset (email)
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    // Profile fields
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    bio: { type: String, default: "" },
    occupation: { type: String, default: "" },
    education: { type: String, default: "" },
    canHelpWith: [{ type: String }],
    needHelpWith: [{ type: String }],
    location: { type: String, default: "" },
    avatar: { type: String, default: "/default-avatar.png" },

    // Social connections
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
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
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
