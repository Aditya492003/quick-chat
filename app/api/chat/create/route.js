import connectDB from "@/config/db";
import { checkAndUpdateChatQuota } from "@/config/quota";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
        }

        const quotaResult = await checkAndUpdateChatQuota(userId);
        if (!quotaResult.allowed) {
            return NextResponse.json({
                success: false,
                rateLimited: true,
                message: quotaResult.error,
                quota: quotaResult.quota,
            }, { status: 429 });
        }

        const chatData = {
            userId,
            messages: [],
            name: "New chat",
        };

        await connectDB();
        const chat = await Chat.create(chatData);
        return NextResponse.json({
            success: true,
            message: "Chat created",
            chat,
            quota: quotaResult.quota,
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
