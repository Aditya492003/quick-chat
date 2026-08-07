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

        const { chatId } = await req.json();

        if (!chatId) {
            return NextResponse.json({ success: false, message: "Missing chatId" }, { status: 400 });
        }

        await connectDB();
        await Chat.deleteOne({ _id: chatId, userId });
        return NextResponse.json({ success: true, message: "Chat deleted" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}