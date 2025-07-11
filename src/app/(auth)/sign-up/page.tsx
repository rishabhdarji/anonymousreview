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
import { signUpSchema } from "@/schemas/signUpSchema";
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

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const debounced = useDebounceCallback(setUsername, 300);
  const router = useRouter();

  // zod will be implement from here
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "An error occurred"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast(`Success: ${response.data.message}`);
      router.replace(`/verify/${data.username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error during sign up:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      // eslint-disable-next-line prefer-const
      let errorMessage =
        axiosError.response?.data.message || "An error occurred during sign up";
      toast(
        <div>
          <strong>Sign-up Failed</strong>
          <div>{errorMessage}</div>
        </div>,
        { style: { background: "#f87171", color: "#fff" } }
      );
      setIsSubmitting(false);
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
            Join Crypt Leap{" "}
          </h1>
          <p className="mb-4">
            Create an account to start your journey with us.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  <p
                    className={`text-sm ${usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}
                  >
                    {usernameMessage}
                  </p>
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
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

                  {/* Password validation feedback */}
                  {watchedPassword && (
                    <div className="space-y-1 mt-2 text-sm">
                      <div
                        className={`flex items-center gap-1 ${passwordValidation.isValid ? "text-green-600" : "text-gray-600"}`}
                      >
                        {passwordValidation.isValid ? (
                          <Check size={16} className="text-green-600" />
                        ) : (
                          <AlertCircle size={16} />
                        )}
                        {passwordValidation.isValid
                          ? "Strong password"
                          : "Password requirements:"}
                      </div>

                      {!passwordValidation.isValid && (
                        <ul className="pl-5 space-y-1">
                          <li
                            className={`flex items-center gap-1 ${passwordValidation.minLength ? "text-green-600" : "text-red-500"}`}
                          >
                            {passwordValidation.minLength ? (
                              <Check size={14} />
                            ) : (
                              <X size={14} />
                            )}
                            At least 6 characters
                          </li>
                          <li
                            className={`flex items-center gap-1 ${passwordValidation.maxLength ? "text-green-600" : "text-red-500"}`}
                          >
                            {passwordValidation.maxLength ? (
                              <Check size={14} />
                            ) : (
                              <X size={14} />
                            )}
                            Maximum 20 characters
                          </li>
                          <li
                            className={`flex items-center gap-1 ${passwordValidation.hasUppercase ? "text-green-600" : "text-red-500"}`}
                          >
                            {passwordValidation.hasUppercase ? (
                              <Check size={14} />
                            ) : (
                              <X size={14} />
                            )}
                            At least one uppercase letter
                          </li>
                          <li
                            className={`flex items-center gap-1 ${passwordValidation.hasLowercase ? "text-green-600" : "text-red-500"}`}
                          >
                            {passwordValidation.hasLowercase ? (
                              <Check size={14} />
                            ) : (
                              <X size={14} />
                            )}
                            At least one lowercase letter
                          </li>
                          <li
                            className={`flex items-center gap-1 ${passwordValidation.hasNumber ? "text-green-600" : "text-red-500"}`}
                          >
                            {passwordValidation.hasNumber ? (
                              <Check size={14} />
                            ) : (
                              <X size={14} />
                            )}
                            At least one number
                          </li>
                          <li
                            className={`flex items-center gap-1 ${passwordValidation.hasNoSpecialChars ? "text-green-600" : "text-red-500"}`}
                          >
                            {passwordValidation.hasNoSpecialChars ? (
                              <Check size={14} />
                            ) : (
                              <X size={14} />
                            )}
                            No special characters (letters and numbers only)
                          </li>
                        </ul>
                      )}
                    </div>
                  )}
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default page;
