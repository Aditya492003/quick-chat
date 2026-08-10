import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const chatId = searchParams.get("id");

        if (!chatId) {
            return NextResponse.json({ success: false, message: "Chat ID is required" }, { status: 400 });
        }

        await connectDB();
        const chat = await Chat.findById(chatId).select("name messages createdAt");

        if (!chat) {
            return NextResponse.json({ success: false, message: "Chat not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            chat,
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
