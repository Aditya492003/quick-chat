import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "User not authenticated",
            }, { status: 401 });
        }

        const { chatId, name } = await req.json();

        if (!chatId || !name) {
            return NextResponse.json({ success: false, message: "Missing chatId or name" }, { status: 400 });
        }

        await connectDB();
        const updatedChat = await Chat.findOneAndUpdate(
            { _id: chatId, userId },
            { name },
            { new: true }
        );

        return NextResponse.json({ success: true, message: "Chat renamed", chat: updatedChat });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}