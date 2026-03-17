import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/dist/types/server";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const {userId} = getAuth(req)

        if(!userId) {
            return NextResponse.json({success: false, message: "user not authonticated", })
        }
//prepare the chat data to be saved in data the databased
  
        const chatData = {
            userId,
            messages: [],
            name: "New chat",
        };

        //connect the db
        await connectDB();
        await Chat.create(chatData);
        return NextResponse.json({success: true, message: "chat created"})

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message});
    }
}