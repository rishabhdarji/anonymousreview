/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import messages from "@/messages.json";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { useState, useEffect, JSX } from "react";
import { Button } from "@/components/ui/button";

const Page = () => {
  const { data: session } = useSession();
  const username = (session?.user as User)?.username || "user";
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (e.target.value.length < 3) {
      setError("Minimum 3 letters should be written in the text.");
    } else {
      setError("");
    }
  };

  const handleSend = () => {
    if (message.length < 3) {
      setError("Minimum 3 letters should be written in the text.");
      return;
    }
    // ...send logic...
  };

  const handleSuggestMessages = () => {
    // ...suggest messages logic...
  };

  return (
    <>
      <main
        className="flex-grow flex flex-col items-center justify-center px-4 md:px-0 py-0 min-h-screen relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #101415 0%, #1a2223 100%)",
          position: "relative",
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
        <MatrixRain />
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
            />
            {error && (
              <div className="text-red-400 text-sm mt-2 text-center">
                {error}
              </div>
            )}
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleSend}
                className="custom-send-btn text-gray-900 font-semibold transition-transform duration-200"
                style={{ backgroundColor: "#f1f1deff", color: "#222" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#c5c5afff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f5f5dc")
                }
              >
                Send
              </Button>
            </div>
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleSuggestMessages}
                className="custom-send-btn text-gray-900 font-semibold transition-transform duration-200"
                style={{ backgroundColor: "#f1f1deff", color: "#222" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#c5c5afff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f5f5dc")
                }
              >
                Suggest Messages
              </Button>
            </div>
            <div className="text-center text-gray-300 text-sm mt-3">
              Click on any message below to select it.
            </div>
          </div>
        </div>
      </main>
      <footer>
        <div className="bg-gray-900 text-gray-300 text-center py-6 border-t border-gray-800">
          <p className="text-sm tracking-wide">
            © 2025 Speak Your Truth. All rights reserved.
          </p>
        </div>
      </footer>
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
