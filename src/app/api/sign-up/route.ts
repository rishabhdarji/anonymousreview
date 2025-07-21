/* eslint-disable prefer-const */
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    
    // Check if the user already exists
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message:
            "Username already exists. Please choose a different username.",
        },
        { status: 400 }
      );
    }
    const existingUserVerifiedByEmail = await UserModel.findOne({
      email,
    });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

    if (existingUserVerifiedByEmail) {
      if (existingUserVerifiedByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: 'User already exists with this email',
          },
          { status: 400 }
        );
      } else {
      // Update the existing unverified user
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUserVerifiedByEmail.password = hashedPassword;
      existingUserVerifiedByEmail.verifyCode = verifyCode;
      existingUserVerifiedByEmail.verifyCodeExpires = new Date(Date.now() + 3600000); // OTP expires in 1 hour
      await existingUserVerifiedByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpires: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }
      // Send verification email
      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      );
      if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: emailResponse.message,
          },
          { status: 500 }
        );
      }

      return Response.json(
        {
          success: true,
          message:
            "User registered successfully. Please check your email for the verification code.",
        },
        { status: 201 }
      );
    } catch (error) {
    console.error(
      "Error registering user:",
      error
    );
    return Response.json(
      {
        success: false,
        message: "Failed to register the user. Please try again later.",
      },
      { status: 500 }
    );
  }
}
