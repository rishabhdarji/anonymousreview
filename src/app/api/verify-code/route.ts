import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function POST(request: Request) {
    await dbConnect();
    try {
        const {username, code} = await request.json();
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUsername});
        if (!user) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeExpired = new Date(user.verifyCodeExpires) > new Date();
        if(isCodeValid && isCodeExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json(
                { success: true, message: "Account verified successfully" },
                { status: 200 }
            );
        }
        else if (!isCodeValid) {
            return Response.json(
                { success: false, message: "Invalid verification code" },
                { status: 400 }
            );
        }
        else {
            return Response.json(
                { success: false, message: "Verification code has expired or incorrect verification code" },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error("Error verifying code:", error);
        return Response.json(
            { success: false, message: "Error Verifying User" },
            { status: 500 } 
        );
        
    }
}