import mongoose from "mongoose";
import { createHmac, randomBytes } from "crypto";
import { createTokenForUser } from "../service/authentication.js";

const userModelSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: "/images/defaultAvatar.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);
userModelSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;
  const salt = randomBytes(10).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedPassword;
  next();
});
userModelSchema.static(
  "matchPasswordandGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) return 1;
    const salt = user.salt;
    const hashPass = user.password;
    const inputPass = createHmac("sha256", salt).update(password).digest("hex");
    if (hashPass !== inputPass) return 2;

    const token = createTokenForUser(user);
    return token;
  }
);

const userModel = mongoose.model("users", userModelSchema);
export default userModel;
