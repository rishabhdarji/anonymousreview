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
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-0 py-0 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 relative overflow-hidden">
        {/* Decorative blurred background shapes */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600 opacity-30 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl -z-10 animate-pulse" />
        <section className="text-center mb-12 mt-20">
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
            Speak your truth, anonymously.
          </h1>
          <p className="mt-6 text-lg md:text-2xl text-gray-200 font-medium max-w-2xl mx-auto">
            Reviews with privacy at their core. Your thoughts are safe with us.
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
                    <Card className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border-0 shadow-xl rounded-2xl transition-transform hover:scale-105">
                      <CardHeader className="pb-2">
                        <span className="text-xl font-bold text-purple-300">
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
            <CarouselPrevious className="bg-gray-700/70 hover:bg-purple-600/80 text-white border-none shadow-md" />
            <CarouselNext className="bg-gray-700/70 hover:bg-purple-600/80 text-white border-none shadow-md" />
          </Carousel>
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
