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
import Link from 'next/link';
import { User } from 'next-auth';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw } from 'lucide-react';
import MessageCard from '@/components/MessageCard';

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
    try{
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue("acceptMessages", !acceptMessages)
      toast(response.data.message, {
          description: "Accept messages status updated successfully.",
        })

    }
    catch (error){
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(axiosError.response?.data.message || "Failed to update accept messages status");
    }
   }

  const {username} = session?.user as User;
  
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/user/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Profile URL copied to clipboard", {
      description: "You can share your profile URL with others.",
    });
  }

  if (!session || !session.user) {
    return <div>
      Please Login to view your dashboard.
      <br />
      <Link href="/sign-in" className="text-blue-500 hover:underline">Sign In</Link>
    </div> 
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded-lg shadow-md max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">
        Welcome, {session.user.name || session.user.email}!
      </h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">
          Copy your unique profile URL: 
        </h2>{' '}
        <div className="flex items-center space-x-2">
          <input 
          type="text" 
          value={profileUrl}
          disabled
          className="input input-bordered w-full p-2 mr-2"
          />
          <button 
          onClick={copyToClipboard}
          className="btn btn-primary"
          >
            Copy
          </button>
        </div>
      </div>

      <div className='mb-4'>
        <Switch 
        {...register("acceptMessages")}
        checked={acceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitchLoading}
        className="w-full max-w-xs"
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "Enabled" : "Disabled"}
        </span>
      </div>

      <Separator />

      <Button
        className="mt-4"
        variant={"outline"}
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
        >
          {isLoading ? (
            <Loader2 className='animate-spin h-4 w-4' />
          ) : (
            <RefreshCcw className='h-4 w-4' />
          )}
        </Button>

        <div className='mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard 
              key={String(message._id)}
              message={message}
              onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
    </div> 
  )
}
 
export default Page
