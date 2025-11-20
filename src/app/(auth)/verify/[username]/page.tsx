/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

function VerifyAccount() {
  const route = useRouter();
  const param = useParams<{ username: string }>();
  const [verified, setVerified] = useState(false); // <-- NEW STATE

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: param.username,
        code: data.code,
      });

      toast.success(`Verification successful: ${response.data.message}`);
      setVerified(true); // <-- SET VERIFIED
    } catch (error) {
      console.error("Verification failed:", error);
      const errMsg =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response?.data?.message === "string"
          ? (error as any).response.data.message
          : "An error occurred";
      // Show 'invalid code' toast if the error message indicates invalid code
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as any).response?.data?.message
          ?.toLowerCase()
          .includes("invalid")
      ) {
        toast.error("invalid code");
      } else {
        toast.error(`Signup failed: ${errMsg}`);
      }
    }
  };

  // --- Manual Verification Logic ---
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState<{ q: string; a: number } | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [retrievedCode, setRetrievedCode] = useState<string | null>(null);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setCaptchaQuestion({ q: `What is ${num1} + ${num2}?`, a: num1 + num2 });
    setShowCaptcha(true);
    setRetrievedCode(null);
    setCaptchaAnswer("");
  };

  const handleCaptchaSubmit = async () => {
    if (!captchaQuestion) return;
    if (parseInt(captchaAnswer) !== captchaQuestion.a) {
      toast.error("Incorrect CAPTCHA answer");
      return;
    }

    try {
      const response = await axios.post("/api/get-verification-code", {
        username: param.username,
      });
      if (response.data.success) {
        setRetrievedCode(response.data.code);
        toast.success("Verification code retrieved!");
        setShowCaptcha(false);
      } else {
        toast.error("Failed to retrieve code");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching code");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Account
          </h2>
          <p className="mb-4">
            Enter the verification code sent to your email.
          </p>
        </div>
        {!verified ? (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your verification code"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-md bg-gradient-to-r from-gray-700 via-gray-900 to-black text-white font-semibold shadow-sm transition-all duration-300
                    hover:from-gray-800 hover:via-black hover:to-gray-900
                    hover:scale-105 hover:shadow-lg
                    focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2
                    active:scale-100"
                >
                  Verify
                </button>
              </form>
            </Form>

            {/* Manual Verification Section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              {!showCaptcha && !retrievedCode && (
                <button
                  onClick={generateCaptcha}
                  className="text-sm text-blue-600 hover:underline w-full text-center"
                >
                  Didn&apos;t receive the code? Click here.
                </button>
              )}

              {showCaptcha && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    Solve this CAPTCHA to get your code:
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg bg-gray-100 px-2 py-1 rounded">
                      {captchaQuestion?.q}
                    </span>
                    <Input
                      value={captchaAnswer}
                      onChange={(e) => setCaptchaAnswer(e.target.value)}
                      placeholder="Answer"
                      className="w-24"
                    />
                    <button
                      onClick={handleCaptchaSubmit}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}

              {retrievedCode && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-center">
                  <p className="text-sm text-green-800 mb-1">Your verification code:</p>
                  <p className="text-2xl font-mono font-bold text-green-900 tracking-widest">
                    {retrievedCode}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Enter this code above to verify.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <div className="text-green-600 text-lg font-semibold">
              Your account has been verified!
            </div>
            <button
              onClick={() => route.replace("/sign-in")}
              className="py-2 px-6 rounded-md bg-emerald-700 text-white font-semibold shadow-sm transition-all duration-300
              hover:bg-emerald-800
              hover:scale-105 hover:shadow-lg
              focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2
              active:scale-100"
            >
              Sign In to Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VerifyAccount;
