import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        name: { type: String, required: false, default: "User" },
        email: { type: String, required: false, default: "" },
        image: { type: String, required: false, default: "" },
        chatCount: { type: Number, default: 0 },
        chatWindowStart: { type: Date, default: Date.now },
        tokensUsed: { type: Number, default: 0 },
        tokenWindowStart: { type: Date, default: Date.now },
        responseBlockedUntil: { type: Date, default: null },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema)

export default User;