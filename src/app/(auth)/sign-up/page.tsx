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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import animationData from './loader.json';
import { Loader2 } from "lucide-react";


const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
              name ="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                  <Input placeholder="username" {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                <p className={`text=-sm ${usernameMessage === "Username is available" ? 'text-green-500': 'text-red-500'}`}>
                  {usernameMessage}
                </p>
                </FormItem>
              )}
            />

            <FormField
              name ="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                  <Input placeholder="email" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name ="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                  <Input placeholder="password" {...field} type="password" />
                  </FormControl>
                </FormItem>
              )}
            />
          <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (
                <>
                <Loader2 className="animate-spin" />
                Loading...
                </>
            ) : ("Sign Up")
              }
            
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
