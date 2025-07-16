/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import { Message } from '@/model/User'
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, {AxiosError} from 'axios';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react'
import { set, useForm } from 'react-hook-form';
import { toast } from "sonner";
import { fi } from 'zod/v4/locales';

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }
  const {data:session} = useSession()
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema)
  })
  const {register, watch, setValue} = form;
  const acceptMessages = watch("acceptMessages")
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get('/api/accept-messages')
      setValue("acceptMessages", response.data.isAcceptingMessages)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to fetch accept messages status"); 
    }
    finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if(refresh){
        toast("Refreshed messages", {
          description: "Showing latest messages.",
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to fetch accept messages status"); 
    }
    finally {
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }, [setIsLoading, setMessages])

  useEffect(()=>{
    if(!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, setValue, fetchMessages, fetchAcceptMessage])

   //handle switch change
   const handleSwitchChange = async() => {
    
   }

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  )
}
 
export default Page
