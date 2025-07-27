/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Clock, MessageSquare, Trash2 } from "lucide-react";
import { Message } from "@/model/User";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-messages/${message._id}`
      );
      toast.success("Message deleted successfully");
      onMessageDelete(String(message._id));
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  // Format the timestamp relative to now (e.g. "3 hours ago")
  const formattedTime = formatDistanceToNow(new Date(message.createdAt), {
    addSuffix: true,
  });

  return (
    <Card className="relative group bg-gradient-to-br from-[#1a1f1d] to-[#1b211f] border-0 shadow-xl overflow-hidden">
      {/* Glowing border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#19c37d10] via-[#19c37d20] to-[#19c37d10] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="absolute inset-0 border border-[#19c37d20] rounded-lg"></div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMjgyYzJhIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMzOTNjM2EiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')]"></div>

      <CardHeader className="relative pb-2 pt-4 px-5 flex flex-row justify-between items-center border-b border-[#19c37d15]">
        <div className="flex items-center gap-1.5">
          <MessageSquare className="h-3.5 w-3.5 text-[#19c37d60]" />
          <div className="text-xs font-medium text-white">
            Anonymous Message
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full opacity-30 hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-all duration-200"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#1b211f] border border-[#19c37d]/50 shadow-[0_0_30px_rgba(25,195,125,0.15)]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#19c37d]">
                Delete this message?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                This action cannot be undone. This will permanently delete this
                anonymous message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardHeader>

      <CardContent className="py-4 px-5 relative z-10">
        <p className="text-gray-100 whitespace-pre-wrap break-words leading-relaxed">
          {message.content}
        </p>
      </CardContent>

      <CardFooter className="pt-2 pb-4 px-5 flex items-center gap-2 border-t border-[#19c37d15]">
        <Clock className="h-3 w-3 text-[#19c37d40]" />
        <div className="text-xs text-gray-400 font-mono">{formattedTime}</div>
      </CardFooter>
    </Card>
  );
};

export default MessageCard;
