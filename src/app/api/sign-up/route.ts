import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
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

    if (existingUserVerifiedByEmail && existingUserVerifiedByEmail.isVerified) {
      return Response.json(
        {
          success: false,
          message: "Email already exists. Please choose a different email.",
        },
        { status: 400 }
      );
    } else if (
      existingUserVerifiedByEmail &&
      !existingUserVerifiedByEmail.isVerified
    ) {
      // Update the existing unverified user
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUserVerifiedByEmail.username = username;
      existingUserVerifiedByEmail.password = hashedPassword;
      existingUserVerifiedByEmail.verifyCode = verifyCode;
      existingUserVerifiedByEmail.verifyCodeExpires = new Date(
        Date.now() + 3600000
      ); // OTP expires in 1 hour
      await existingUserVerifiedByEmail.save();

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
    } else {
      // Create a new user
      const verifyCodeExpires = new Date(Date.now() + 3600000); // OTP expires in 1 hour
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpires,
        isVerified: false,
        isAcceptingMessages: true, // Default to accepting messages;
        messages: [], // Initialize with an empty array
      });

      await newUser.save();

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
    }
  } catch (error) {
    console.error(
      "Error connecting to the database, failed to register user:",
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
