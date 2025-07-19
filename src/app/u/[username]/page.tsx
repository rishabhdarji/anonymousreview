"use client";
import messages from "@/messages.json";
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const page = () => {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-0 py-0 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 relative overflow-hidden">
        {/* Decorative blurred background shapes */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600 opacity-30 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl -z-10 animate-pulse" />
        <section className="text-center mb-12 mt-20">
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
            Public Profile Link.
          </h1>
        </section>
        <div className="w-full flex flex-col items-center">
           <Label htmlFor="message">Your message</Label>
      <Textarea placeholder="Type your message here." id="message" />
        </div>
        <div className="mt-16 flex flex-col items-center gap-4">
          <a
            href="/sign-up"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition-transform duration-200"
          >
            Get Started
          </a>
          <span className="text-gray-300 text-sm">
            Join now and start sharing your thoughts safely.
          </span>
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

export default page;
