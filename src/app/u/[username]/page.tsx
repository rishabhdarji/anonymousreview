/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import messages from "@/messages.json";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useState, useEffect, JSX } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// --- message schema for validation ---
const messageSchema = z.object({
  content: z
    .string()
    .min(3, "Minimum 3 letters should be written in the text."),
});
const specialChar = "||";
const parseStringMessages = (messageString: string): string[] => {
  return messageString
    .split(specialChar)
    .map((msg) => {
      // Remove wrapping quotes if present
      msg = msg.trim();
      if (msg.startsWith('"') && msg.endsWith('"')) {
        msg = msg.slice(1, -1).trim();
      }
      return msg;
    })
    .filter(Boolean);
};
const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

const Page = () => {
  useEffect(() => {
    // This runs only on the client after hydration
    // It's safe to access document here
    const suppressHydrationWarning = () => {
      // This suppresses the specific warning for this component
      if (process.env.NODE_ENV !== "production") {
        console.log(
          "Suppressed hydration warning caused by browser extensions"
        );
      }
    };

    suppressHydrationWarning();
  }, []);
  const { data: session } = useSession();
  const username = (session?.user as User)?.username || "user";
  const params = useParams<{ username: string }>();

  // --- advanced form logic ---
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });
  const message = form.watch("content");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(initialMessageString);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  // --- suggested messages logic ---
  const completion = suggestions;
  const showSuggestError = Boolean(suggestError);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    form.setValue("content", e.target.value);
  };

  const handleSend = async () => {
    if (message.length < 3) {
      form.setError("content", {
        type: "manual",
        message: "Minimum 3 letters should be written in the text.",
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username: params.username,
        content: message,
      });
      toast.success("Message sent successfully!", {
        description: "Your anonymous message has been delivered.",
      });
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.status === 403) {
        toast.error("Message not sent", {
          description: "This user is not currently accepting messages.",
        });
      } else {
        toast.error("Failed to send message", {
          description:
            axiosError.response?.data.message ||
            "An error occurred while sending your message.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestMessages = async () => {
    setIsSuggestLoading(true);
    setSuggestError(null);
    try {
      const response = await fetch("/api/suggest-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error("Request failed");
      const data = await response.json();
      if (!data?.completion) throw new Error("Empty completion");
      setSuggestions(data.completion);
      toast.success("Suggestions loaded successfully!");
    } catch (error) {
      setSuggestError("Failed to load suggestions. Please try again.");
      toast.error("Failed to fetch message suggestions");
    } finally {
      setIsSuggestLoading(false);
    }
  };

  const handleMessageClick = (msg: string) => {
    form.setValue("content", msg);
  };

  useEffect(() => {
    console.log("Completion value:", completion);
  }, [completion]);

  return (
    <>
      {/* Matrix rain effect wrapper - now wrapping the entire content */}
      <div
        className="relative min-h-screen"
        style={{
          background: "linear-gradient(135deg, #101415 0%, #1a2223 100%)",
        }}
      >
        <MatrixRain />

        <main
          className="flex-grow flex flex-col items-center justify-center px-4 md:px-0 py-0 min-h-screen relative overflow-hidden"
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Anonymous mask background */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "520px",
              height: "520px",
              maxWidth: "95vw",
              maxHeight: "95vh",
              transform: "translate(-50%, -50%)",
              opacity: 0.13,
              zIndex: 0,
              pointerEvents: "none",
              filter: "drop-shadow(0 0 32px #00ff41aa) blur(0.5px)",
              transition: "opacity 0.3s",
            }}
          >
            <svg
              viewBox="0 0 512 512"
              width="100%"
              height="100%"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Guy Fawkes/Anonymous mask silhouette */}
              <ellipse
                cx="256"
                cy="256"
                rx="240"
                ry="240"
                fill="#101415"
                opacity="0.95"
              />
              <g>
                {/* Face outline */}
                <path
                  d="M128 128 Q256 32 384 128 Q416 256 384 384 Q256 480 128 384 Q96 256 128 128 Z"
                  fill="#181f1b"
                  stroke="#00ff41"
                  strokeWidth="3"
                  opacity="0.85"
                />
                {/* Eyes */}
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
                {/* Eye shadows */}
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
                {/* Mustache */}
                <path
                  d="M180 260 Q200 275 256 270 Q312 275 332 260"
                  stroke="#00ff41"
                  strokeWidth="4"
                  fill="none"
                  opacity="0.8"
                />
                {/* Smile */}
                <path
                  d="M200 320 Q256 350 312 320"
                  stroke="#00ff41"
                  strokeWidth="4"
                  fill="none"
                  opacity="0.7"
                />
                {/* Goatee */}
                <path
                  d="M246 350 Q256 370 266 350"
                  stroke="#00ff41"
                  strokeWidth="3"
                  fill="none"
                  opacity="0.7"
                />
                {/* Cheek lines */}
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
                {/* Nose */}
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

          {/* Hacker-style animated matrix/rain effect */}
          <style>
            {`
              @keyframes matrix-fall {
                0% { transform: translateY(-100vh); opacity: 0; }
                10% { opacity: 1; }
                100% { transform: translateY(100vh); opacity: 0; }
              }
              .matrix-rain {
                pointer-events: none;
                position: absolute;
                inset: 0;
                z-index: 0;
                overflow: hidden;
                height: 100%;
                width: 100%;
              }
              .matrix-char {
                position: absolute;
                color: #00ff41;
                font-family: 'Fira Mono', 'Consolas', monospace;
                font-size: 1.1rem;
                opacity: 0.18;
                user-select: none;
                animation: matrix-fall linear infinite;
                white-space: pre;
              }
            `}
          </style>

          <section className="text-center mb-12 mt-20">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-100 mb-2 drop-shadow-xl tracking-wide">
              Share Your Unique Anonymous Link
            </h1>
            <p className="text-lg text-gray-400 mt-2">
              Let others send you honest feedback, confessions, or compliments.
            </p>
          </section>
          <div className="w-full flex flex-col items-center">
            <div className="mb-6 w-full max-w-lg">
              <Label
                htmlFor="message"
                className="block text-lg font-semibold text-gray-200 mb-2 text-center"
              >
                Send Anonymous Message to @{username}.
              </Label>
              <Textarea
                placeholder="Type your message here."
                id="message"
                value={message}
                onChange={handleTextareaChange}
                className="w-full min-h-[100px] rounded-lg border border-gray-600 bg-gray-800 text-gray-100 focus:ring-2 focus:ring-purple-500 transition"
                suppressHydrationWarning
              />
              {form.formState.errors.content && (
                <div className="text-red-400 text-sm mt-2 text-center">
                  {form.formState.errors.content.message}
                </div>
              )}
              <div className="flex justify-center mt-4">
                <Button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="custom-send-btn text-gray-900 font-semibold transition-transform duration-200"
                  style={{ backgroundColor: "#f1f1deff", color: "#222" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#c5c5afff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f5f5dc")
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send"
                  )}
                </Button>
              </div>
              <div className="flex justify-center mt-4">
                <Button
                  onClick={handleSuggestMessages}
                  disabled={isSuggestLoading}
                  className="custom-send-btn text-gray-900 font-semibold transition-transform duration-200"
                  style={{ backgroundColor: "#f1f1deff", color: "#222" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#c5c5afff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f5f5dc")
                  }
                >
                  {isSuggestLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading suggestions...
                    </>
                  ) : (
                    "Suggest Messages"
                  )}
                </Button>
              </div>
              <div className="text-center text-gray-300 text-sm mt-3">
                Click on any message below to select it.
              </div>
              {/* --- suggested messages UI --- */}
              {completion && (
                <div className="mt-6 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                  <h3 className="text-lg font-medium text-gray-200 mb-3">
                    Suggested Messages
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {parseStringMessages(completion).map(
                      (suggestedMsg, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          className="bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600 text-left whitespace-normal break-words justify-start h-auto"
                          onClick={() => handleMessageClick(suggestedMsg)}
                        >
                          {suggestedMsg}
                        </Button>
                      )
                    )}
                  </div>
                </div>
              )}
              {showSuggestError && (
                <div className="text-red-400 text-sm mt-4 text-center">
                  {suggestError}
                </div>
              )}
            </div>
          </div>
        </main>
        <footer>
          <div className="text-gray-400 text-center py-6">
            <p className="text-sm tracking-wide font-mono">
              © 2025 Anonymous Review. Privacy. Honesty. Freedom.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

// Hacker matrix rain overlay component
function MatrixRain() {
  const [drops, setDrops] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const columns = 32;
    const chars = "01abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&";
    const newDrops = Array.from({ length: columns }).map((_, i) => {
      const left = `${(i / columns) * 100}%`;
      const delay = `${Math.random() * 3}s`;
      const duration = `${2.5 + Math.random() * 2.5}s`;
      const char = chars[Math.floor(Math.random() * chars.length)];
      const opacity = 0.12 + Math.random() * 0.18;
      return (
        <span
          key={i}
          className="matrix-char"
          style={{
            left,
            animationDelay: delay,
            animationDuration: duration,
            opacity,
          }}
        >
          {char}
        </span>
      );
    });
    setDrops(newDrops);
  }, []);

  return <div className="matrix-rain">{drops}</div>;
}

export default Page;
