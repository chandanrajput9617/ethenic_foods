import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import mongoosePaginate from "mongoose-paginate-v2";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowecase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      default: "user",
      lowecase: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      lowecase: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      lowecase: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      lowecase: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      lowecase: true,
      trim: true,
    },
    zipcode: {
      type: String,
      required: true,
      lowecase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.plugin(mongoosePaginate);
export const User = mongoose.model("User", userSchema);
