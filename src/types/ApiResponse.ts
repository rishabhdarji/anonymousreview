import { Message } from "@/model/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean; // Optional field to indicate if the user is accepting messages
  messages?: Array<Message>; // Optional field to include messages in the response
}
