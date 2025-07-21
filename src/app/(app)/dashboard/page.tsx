/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Message } from "@/model/User";
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";
import { User } from "next-auth";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw, Copy } from "lucide-react";
import MessageCard from "@/components/MessageCard";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const [profileUrl, setProfileUrl] = useState("");
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };
  const { data: session } = useSession();
  const username = session?.user ? (session.user as User).username : undefined;
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Failed to fetch accept messages status"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast("Refreshed messages", {
            description: "Showing latest messages.",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message ||
            "Failed to fetch messages"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

   useEffect(() => {
    if (typeof window !== "undefined" && username) {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${baseUrl}/user/${username}`);
    }
  }, [username]);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchMessages, fetchAcceptMessage]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast(response.data.message, {
        description: "Accept messages status updated successfully.",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Failed to update accept messages status"
      );
    }
  };

  if (!session || !session.user) {
    return (
      <div></div>
    );
  }

  const copyToClipboard = () => {
    if (profileUrl) {
      navigator.clipboard.writeText(profileUrl);
      toast.success("Profile URL copied to clipboard", {
        description: "You can share your profile URL with others.",
      });
    }
  };

  // if (!session || !session.user) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#101415] via-[#181f1b] to-[#232b2b]">
  //       <div className="bg-black/60 p-8 rounded-xl shadow-xl text-white text-center">
  //         Please Login to view your dashboard.
  //         <br />
  //         <Link href="/sign-in" className="text-green-400 hover:underline">
  //           Sign In
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div
      className="relative min-h-screen bg-gradient-to-br from-[#101415] via-[#181f1b] to-[#232b2b] flex flex-col items-center py-10 px-2 md:px-8"
      data-scroll-section
    >
      {/* Anonymous mask watermark */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          width: "340px",
          height: "340px",
          opacity: 0.09,
          zIndex: 0,
          pointerEvents: "none",
          filter: "drop-shadow(0 0 24px #00ff41aa) blur(0.5px)",
        }}
      >
        <svg viewBox="0 0 512 512" width="100%" height="100%" fill="none">
          <ellipse
            cx="256"
            cy="256"
            rx="240"
            ry="240"
            fill="#101415"
            opacity="0.95"
          />
          <g>
            <path
              d="M128 128 Q256 32 384 128 Q416 256 384 384 Q256 480 128 384 Q96 256 128 128 Z"
              fill="#181f1b"
              stroke="#00ff41"
              strokeWidth="3"
              opacity="0.85"
            />
            <ellipse
              cx="185"
              cy="220"
              rx="22"
              ry="10"
              fill="#fff"
              opacity="0.8"
            />
            <ellipse
              cx="327"
              cy="220"
              rx="22"
              ry="10"
              fill="#fff"
              opacity="0.8"
            />
            <path
              d="M163 220 Q185 210 207 220"
              stroke="#00ff41"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M305 220 Q327 210 349 220"
              stroke="#00ff41"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M180 260 Q200 275 256 270 Q312 275 332 260"
              stroke="#00ff41"
              strokeWidth="4"
              fill="none"
              opacity="0.8"
            />
            <path
              d="M200 320 Q256 350 312 320"
              stroke="#00ff41"
              strokeWidth="4"
              fill="none"
              opacity="0.7"
            />
            <path
              d="M246 350 Q256 370 266 350"
              stroke="#00ff41"
              strokeWidth="3"
              fill="none"
              opacity="0.7"
            />
            <path
              d="M170 270 Q160 290 180 300"
              stroke="#00ff41"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M342 270 Q352 290 332 300"
              stroke="#00ff41"
              strokeWidth="2"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M256 240 Q260 250 256 260 Q252 250 256 240"
              stroke="#00ff41"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
          </g>
        </svg>
      </div>
      {/* Dashboard header */}
      <header className="w-full max-w-5xl z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
          Dashboard
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Manage your anonymous profile, control your privacy, and view your
          received messages.
        </p>
      </header>
      {/* Profile URL card */}
      <div className="w-full max-w-2xl mb-6 z-10">
        <div
          className="rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-4 border"
          style={{
            background: "linear-gradient(135deg, #232b2b 80%, #232b2b 100%)",
            border: "1.5px solid #19c37d",
            boxShadow: "0 0 0 1.5px #19c37d44, 0 2px 16px 0 #19c37d22",
            backdropFilter: "blur(2px)",
          }}
        >
          <div className="flex-1 w-full">
            <div className="text-gray-300 text-sm mb-1 font-semibold">
              Your public profile link
            </div>
            <input
              type="text"
              value={profileUrl}
              disabled
              className="w-full bg-[#161b1a] text-green-400 font-mono px-3 py-2 rounded-lg border border-[#19c37d] focus:outline-none focus:ring-2 focus:ring-green-400/40 transition"
            />
          </div>
          <Button
            onClick={copyToClipboard}
            className="font-semibold transition-transform duration-200"
            style={{
              backgroundColor: "#19c37d",
              color: "#181f1b",
              border: "1.5px solid #19c37d",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#13996d")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#19c37d")
            }
          >
            <Copy className="mr-1" /> Copy
          </Button>
        </div>
      </div>
      {/* Settings card */}
      <div className="w-full max-w-2xl mb-8 z-10">
        <div
          className="rounded-2xl shadow-md p-6 flex flex-col md:flex-row items-center gap-4 border"
          style={{
            background: "rgba(34, 40, 38, 0.92)",
            border: "1.5px solid #19c37d",
            boxShadow: "0 0 0 1.5px #19c37d44, 0 1.5px 8px 0 #19c37d22",
            backdropFilter: "blur(2px)",
          }}
        >
          <div className="flex items-center gap-3 flex-1">
            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
              className="data-[state=checked]:bg-[#19c37d] data-[state=unchecked]:bg-gray-600 border border-[#19c37d] shadow"
            />
            <span className="ml-2 text-gray-100 font-semibold">
              Accept Messages:{" "}
              <span
                className={acceptMessages ? "text-green-400" : "text-red-400"}
              >
                {acceptMessages ? "Enabled" : "Disabled"}
              </span>
            </span>
          </div>
          <Button
            className="transition-transform duration-200"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            style={{
              borderColor: "#19c37d",
              color: "#19c37d",
              background: "transparent",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#19c37d22")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>
      {/* Messages grid */}
      <div className="w-full max-w-6xl z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={String(message._id)}
                className="bg-[#181f1b]/80 rounded-2xl shadow-xl p-0 border border-[#222]/60 hover:scale-[1.025] transition-transform duration-200 backdrop-blur-md"
                style={{
                  boxShadow: "0 4px 32px 0 #00ff4122, 0 1.5px 8px 0 #0008",
                }}
              >
                <MessageCard
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-12 text-lg">
              No messages to display yet.
              <br />
              Share your profile link to receive anonymous feedback!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;