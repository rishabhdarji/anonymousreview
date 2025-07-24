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
