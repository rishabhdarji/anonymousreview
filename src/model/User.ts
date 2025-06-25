import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpires: Date;
  messages: Message[];
  isAcceptingMessages: boolean;
  isVerified: boolean;
}

const UserSchema: Schema<User> = new Schema<User>({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    maxlength: 50,
    minlength: 3,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    lowercase: true,
    match: /.+\@.+\..+/,
  },

  password: { type: String, required: [true, "Password is required"] },

  verifyCode: { type: String, required: [true, "Verify code is required"] },

  verifyCodeExpires: {
    type: Date,
    required: [true, "Verify code expire date is required"],
  },

  messages: [MessageSchema],

  isAcceptingMessages: { type: Boolean, default: true },

  isVerified: { type: Boolean, default: false },
});


const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
