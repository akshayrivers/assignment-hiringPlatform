import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import RecruiterModel from "@/model/Recruiter";

export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await req.json();

        // Checking if a verified recruiter already exists with the given username.
        const existingRecruiterByUsername = await RecruiterModel.findOne({
            username,
            isVerified: true,
        });
        if (existingRecruiterByUsername) {
            return NextResponse.json(
                { success: false, message: "Username already exists" },
                { status: 400 }
            );
        }

        // Checking if a recruiter exists with the given email.
        const existingRecruiterByEmail = await RecruiterModel.findOne({ email });
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingRecruiterByEmail) {
            if (existingRecruiterByEmail.isVerified) {
                return NextResponse.json(
                    { success: false, message: "Email already exists" },
                    { status: 400 }
                );
            } else {
                // if the email is not verified for now then we can allot it to another account meaning we can update password and stuff for that user
                const hashedPassword = await bcrypt.hash(password, 10);
                existingRecruiterByEmail.username = username
                existingRecruiterByEmail.password = hashedPassword;
                existingRecruiterByEmail.verifyCode = verifyCode;
                existingRecruiterByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingRecruiterByEmail.save();
                return NextResponse.json(
                    { success: true, message: "Recruiter updated successfully" },
                    { status: 200 }
                );
            }
        } else {
            // We create a new recruiter with the required role property.
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newRecruiter = new RecruiterModel({
                role: "recruiter",
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: true, /// For now,everyone is verified by default 
            });
            await newRecruiter.save();
            console.log(newRecruiter, "Recruiter registered successfully");

            return NextResponse.json(
                { success: true, message: "Recruiter registered successfully" },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Error registering recruiter" },
            { status: 500 }
        );
    }
}
