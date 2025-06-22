import { Message } from "@/model/Users";

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean; // Optional field to indicate if the user is accepting messages
    messages?: Message[]; // Optional field to include messages in the response
}