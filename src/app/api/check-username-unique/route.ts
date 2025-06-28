import dbConnect from "@/lib/dbConnect";
import z from "zod";
import UserModel from "@/model/User";
import {usernameValidation} from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    
    
    await dbConnect();
    try {
        const {searchParams}: URL = new URL(request.url);
        const queryParam = {
            username: searchParams.get("username")
        }
        const result = UsernameQuerySchema.safeParse(queryParam); //Remove this once the frontend is updated to send the username in the body
        console.log("Parsed result:", result); //remove this very soon.
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                { success: false, message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : "Invalid query parameters", },
                { status: 400 }
            )
        }
        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            username, isVerified: true
        });
        if (existingVerifiedUser) {
            return Response.json(
                { success: false, message: "Username is already taken" },
                { status: 409 }
            );
        }
        return Response.json(
            { success: true, message: "Username is available" },
            { status: 200 }
        ); 

    } catch (error) {
        console.error("Error checking username uniqueness:", error);
        return Response.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        ) 
    }
}