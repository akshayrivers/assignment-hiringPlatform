import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import CandidateModel from "@/model/Candidate";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await req.json();

        // Checking if a verified candidate already exists with the given username.
        const existingCandidateByUsername = await CandidateModel.findOne({
            username,
            isVerified: true,
        });
        if (existingCandidateByUsername) {
            return NextResponse.json(
                { success: false, message: "Username already exists" },
                { status: 400 }
            );
        }

        // Checking if a candidate already exists with the given email.
        const existingCandidateByEmail = await CandidateModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingCandidateByEmail) {
            if (existingCandidateByEmail.isVerified) {
                return NextResponse.json(
                    { success: false, message: "Email already exists" },
                    { status: 400 }
                );
            } else {
                // if the email is not verified for now then we can allot it to another account meaning we can update password and stuff for that user
                const hashedPassword = await bcrypt.hash(password, 10);
                existingCandidateByEmail.username = username
                existingCandidateByEmail.password = hashedPassword;
                existingCandidateByEmail.verifyCode = verifyCode;
                existingCandidateByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingCandidateByEmail.save();
                return NextResponse.json(
                    { success: true, message: "Candidate updated successfully" },
                    { status: 200 }
                );
            }
        } else {
            // We create a new candidate with the required role property.
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newCandidate = new CandidateModel({
                role: "candidate",
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: true, // For now,everyone is verified by default 
            });
            await newCandidate.save();
            console.log(newCandidate, "Candidate registered successfully");

            return NextResponse.json(
                { success: true, message: "Candidate registered successfully" },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Error registering candidate" },
            { status: 500 }
        );
    }
}
