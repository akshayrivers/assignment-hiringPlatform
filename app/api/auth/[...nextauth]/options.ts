import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import CandidateModel from "@/model/Candidate";
import RecruiterModel from "@/model/Recruiter";

// we create different signin for both recruiters and candidates 
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "recruiter",
      name: "Recruiter Sign In",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any): Promise<any> {
        console.log("Recruiter authorize called with credentials:", credentials);// to see the credentials 
        await dbConnect();

        const recruiter = await RecruiterModel.findOne({
          $or: [
            { email: credentials.email },
            { username: credentials.email }
          ]
        });

        if (!recruiter) {
          console.error("Recruiter not found");
          throw new Error("Recruiter not found");
        }
        // for now everyone is verified by default 
        if (!recruiter.isVerified) {
          console.error("Recruiter not verified");
          throw new Error("Recruiter not verified");
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, recruiter.password);
        if (!isPasswordCorrect) {
          console.error("Password incorrect");
          throw new Error("Password incorrect");
        }

        return { ...recruiter.toObject(), role: "recruiter" };
      }
    }),
    CredentialsProvider({
      id: "candidate",
      name: "Candidate Sign In",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any): Promise<any> {
        console.log("Candidate authorize called with credentials:", credentials);// to see the credentials 
        await dbConnect();

        const candidate = await CandidateModel.findOne({
          $or: [
            { email: credentials.email },
            { username: credentials.email }
          ]
        });

        if (!candidate) {
          console.error("Candidate not found");
          throw new Error("Candidate not found");
        }
        // for now everyone is verified by default 
        if (!candidate.isVerified) {
          console.error("Candidate not verified");
          throw new Error("Candidate not verified");
        }

        const isPasswordCorrect = await bcrypt.compare(credentials.password, candidate.password);
        if (!isPasswordCorrect) {
          console.error("Password incorrect");
          throw new Error("Password incorrect");
        }

        return { ...candidate.toObject(), role: "candidate" };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
        token.role = user.role;
        console.log("JWT token after modification:", token);
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        _id: token._id,
        isVerified: token.isVerified,
        username: token.username,
        role: token.role,
      };
      return session;
    }
  },
  pages: {
    signIn: "/signin"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.SECRET
};
