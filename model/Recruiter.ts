import mongoose, { Schema, Document } from "mongoose"

export interface Recruiter extends Document {
    role: string,
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
}

const RecruiterSchema: Schema<Recruiter> = new Schema({
    role: {
        type: String,
        required: [true, "role is required"],
        trim: true,

    },
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },

})

const RecruiterModel = (mongoose.models.Recruiter as mongoose.Model<Recruiter>) || mongoose.model<Recruiter>("Recruiter", RecruiterSchema);

export default RecruiterModel;