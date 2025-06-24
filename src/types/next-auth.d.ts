import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        _id?: string;
        username?: string;
        
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
    }
    
    interface Session {
        user: {
            _id?: string;
            username?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
        } & DefaultSession["user"];
    }
    
    interface JWT {
        user:{
            _id?: string;
            username?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
        }
    }
    }