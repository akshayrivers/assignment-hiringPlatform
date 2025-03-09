import mongoose, { Schema, Document } from "mongoose"

export interface Candidate extends Document {
    role: string,
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
}

const CandidateSchema: Schema<Candidate> = new Schema({
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

const CandidateModel = (mongoose.models.Candidate as mongoose.Model<Candidate>) || mongoose.model<Candidate>("Candidate", CandidateSchema);

export default CandidateModel;