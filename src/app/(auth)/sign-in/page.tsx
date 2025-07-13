/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, AlertCircle } from "lucide-react";
import { signIn } from "next-auth/react";

const page = () => {

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    minLength: false,
    maxLength: true,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasNoSpecialChars: true,
  });
  const router = useRouter();

  // zod will be implement from here
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    });
    if (result?.error) {
      toast.error("Sign In Failed", {
        description: result.error,
      });
    } else {
      toast.success("Sign In Successful", {
        description: "You have successfully signed in.",
      });
    }
    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  // Password field value tracking and validation
  const watchedPassword = form.watch("password");
  useEffect(() => {
    if (watchedPassword !== undefined) {
      const minLength = watchedPassword.length >= 6;
      const maxLength = watchedPassword.length <= 20;
      const hasUppercase = /[A-Z]/.test(watchedPassword);
      const hasLowercase = /[a-z]/.test(watchedPassword);
      const hasNumber = /[0-9]/.test(watchedPassword);
      const hasNoSpecialChars = /^[a-zA-Z0-9]*$/.test(watchedPassword);
      const isValid =
        minLength &&
        maxLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumber &&
        hasNoSpecialChars;

      setPasswordValidation({
        isValid,
        minLength,
        maxLength,
        hasUppercase,
        hasLowercase,
        hasNumber,
        hasNoSpecialChars,
      });
    }
  }, [watchedPassword]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome to Crypt Leap{" "}
          </h1>
          <p className="mb-4">Sign in to your account to continue.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              Sign In
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default page;
