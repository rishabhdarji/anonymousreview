"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

const page = () => {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-0 py-0 min-h-screen bg-gradient-to-br from-[#181f1b] via-[#232b2b] to-[#101415] relative overflow-hidden">
        {/* Glassmorphism floating shapes */}
        <div className="absolute top-10 left-10 w-60 h-60 bg-gradient-to-br from-purple-700/30 via-pink-500/20 to-blue-500/10 rounded-3xl blur-2xl opacity-60 -z-10" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-tr from-blue-700/30 via-purple-500/20 to-pink-500/10 rounded-3xl blur-2xl opacity-50 -z-10" />
        <section className="text-center mb-12 mt-24">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
            Anonymous Reviews,{" "}
            <span className="block md:inline">Real Voices.</span>
          </h1>
          <p className="mt-8 text-xl md:text-2xl text-gray-200 font-medium max-w-2xl mx-auto">
            Speak freely. Share honestly. Your privacy, our promise.
          </p>
        </section>
        <div className="w-full flex flex-col items-center">
          <Carousel
            plugins={[Autoplay({ delay: 3500 })]}
            opts={{
              align: "center",
            }}
            className="w-full max-w-md md:max-w-2xl"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-2">
                    <Card className="bg-gradient-to-br from-[#232b2b]/80 via-[#181f1b]/90 to-[#232b2b]/80 rounded-2xl backdrop-blur-md transition-transform hover:scale-105">
                      <CardHeader className="pb-2">
                        <span className="text-xl font-bold text-purple-300 tracking-wide">
                          {message.title}
                        </span>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center p-6">
                        <span className="text-base md:text-lg font-medium text-gray-100">
                          {message.content}
                        </span>
                        <span className="mt-4 text-xs text-gray-400">
                          {message.received}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-[#232b2b]/70 hover:bg-purple-600/80 text-white border-none shadow-md" />
            <CarouselNext className="bg-[#232b2b]/70 hover:bg-purple-600/80 text-white border-none shadow-md" />
          </Carousel>
        </div>
        <div className="mt-20 flex flex-col items-center gap-4">
          <a
            href="/sign-up"
            className="px-12 py-3 rounded-full bg-white/10 border border-purple-400/40 shadow-xl text-white font-bold text-xl backdrop-blur-md transition-all duration-200
              hover:scale-105 hover:shadow-[0_0_24px_0_#a78bfa88,0_2px_16px_0_#fff2]
              hover:bg-gradient-to-r hover:from-purple-500/80 hover:to-blue-500/80
              hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-400/60"
            style={{
              boxShadow: "0 2px 24px 0 #a78bfa33, 0 1.5px 8px 0 #fff1",
              letterSpacing: "0.03em",
            }}
          >
            Get Started
          </a>
          <span className="text-gray-300 text-base">
            Join now and share your truth, safely and anonymously.
          </span>
        </div>
      </main>
      <footer>
        <div className="bg-[#181f1b] text-gray-400 text-center py-6 border-t border-[#232b2b]">
          <p className="text-sm tracking-wide font-mono">
            © 2025 Anonymous Review. Privacy. Honesty. Freedom.
          </p>
        </div>
      </footer>
    </>
  );
};

export default page;
