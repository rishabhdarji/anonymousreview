"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useDebounceValue } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { signUpSchema } from "@/schemas/signUpSchema";
import { useEffect,useState } from "react";
import axios, {AxiosError} from "axios";
import { ApiResponse } from "@/types/ApiResponse";


const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounceValue(username, 300);
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
 const checkUsernameUnique = async () =>{
  if (debouncedUsername){
    setIsCheckingUsername(true);
    setUsernameMessage("");
  try {
      const response = await axios.post(`/api/check-username-unique?username=${debouncedUsername}`);
      setUsernameMessage(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setUsernameMessage(axiosError.response?.data.message ?? "An error occurred");
    } finally {
      setIsCheckingUsername(false);
    }
  }
};
  checkUsernameUnique();
}, [debouncedUsername]);



return(
  <div>
    page
  </div>
)
};
export default page