"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`p-4 md:p-6 ${
        scrolled ? "bg-gray-900/95 backdrop-blur-md shadow-md" : "bg-gray-800"
      } text-white transition-all duration-300`}
    >
      <div className="container mx-auto flex items-center justify-between flex-col md:flex-row">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-gray-200 transition-colors">
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-100">
              crypt
            </span>
            <span className="font-light text-gray-400">leap</span>
          </span>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden absolute right-4 top-4">
          <Button
            onClick={() => setMenuOpen(!menuOpen)}
            variant="ghost"
            size="icon"
            className="text-white focus:outline-none"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Desktop menu */}
        <div
          className={`md:flex items-center gap-4 ${
            menuOpen ? "flex flex-col w-full mt-4" : "hidden"
          }`}
        >
          {session ? (
            <>
              <div className="relative group mb-3 md:mb-0">
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  Welcome, {user?.username || user?.email}!
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 group-hover:w-full"></div>
              </div>
              <Button
                onClick={() => signOut()}
                className="relative overflow-hidden group bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-700 hover:border-gray-500 w-full md:w-auto transition-all duration-300"
              >
                <span className="relative z-10 text-gray-300 group-hover:text-white transition-colors">
                  Sign Out
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </>
          ) : (
            <Link href="/sign-in" className="w-full md:w-auto">
              <Button className="relative overflow-hidden group bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-700 hover:border-gray-500 w-full md:w-auto transition-all duration-300">
                <span className="relative z-10 text-gray-300 group-hover:text-white transition-colors">
                  Login
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
