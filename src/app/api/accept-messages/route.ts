import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User  = session?.user as User;
 
    if (!session || !session.user) {
        return Response.json(
            { success: false, message: "Unauthorized" },
            { status: 401 } 
        );
    
    const userId = user.id;
    const {acceptMessages} = await request.json();
    
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true,}
        );
        if (!updatedUser) {
            return Response.json(
                { success: false, message: "User not found", updatedUser },
                { status: 404 }
            );
        }
        return Response.json(
            { success: true, message: "User status updated successfully", user: updatedUser },
            { status: 200 }
        );
    } catch (error) {
        console.log("Failed to update user status for accepting messages:", error);
        return Response.json(
            { success: false, message: "Failed to update user status for accepting messages:" },
            { status: 500 }
        );
    }


    }
} 

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User  = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            { success: false, message: "Unauthorized" },
            { status: 401 } 
        );
    }

    const userId = user.id;

    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }
        return Response.json(
            { success: true, isAcceptingMessages: foundUser.isAcceptingMessages },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user accepting messages status:", error);
        return Response.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}