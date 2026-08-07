import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req) {
    try {
        const { userId } = getAuth(req);
        const { chatId, prompt, isDeepThink } = await req.json();

        if (!prompt || typeof prompt !== "string") {
            return NextResponse.json({ success: false, message: "Prompt is required" }, { status: 400 });
        }

        await connectDB();

        let chat = null;
        let previousMessages = [];

        if (chatId && userId) {
            chat = await Chat.findOne({ _id: chatId, userId });
            if (chat) {
                previousMessages = chat.messages.map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                }));
            }
        }

        const systemPrompt = isDeepThink
            ? "You are Quick Chat DeepThink (powered by DeepSeek R1 reasoning & Groq llama-3.3-70b-versatile). Provide structured, step-by-step reasoning and explicit, accurate solutions. Format code blocks clearly using standard Markdown (e.g. ```typescript, ```python)."
            : "You are Quick Chat, a fast, helpful, and highly capable AI assistant like ChatGPT and Gemini. Answer questions concisely and accurately. Always use proper Markdown for formatting, lists, tables, and code snippets.";

        const messagesPayload = [
            { role: "system", content: systemPrompt },
            ...previousMessages,
            { role: "user", content: prompt }
        ];

        const completion = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: messagesPayload,
            temperature: 0.7,
            max_tokens: 4096,
        });

        const aiResponse = completion.choices[0]?.message?.content || "No response received from model.";

        const userMessageObj = { role: "user", content: prompt, timestamp: Date.now() };
        const aiMessageObj = { role: "assistant", content: aiResponse, timestamp: Date.now() };

        if (userId) {
            if (chat) {
                chat.messages.push(userMessageObj, aiMessageObj);
                await chat.save();
            } else {
                const autoName = prompt.trim().slice(0, 30) + (prompt.length > 30 ? "..." : "");
                chat = await Chat.create({
                    userId,
                    name: autoName || "New Chat",
                    messages: [userMessageObj, aiMessageObj],
                });
            }
        }

        return NextResponse.json({
            success: true,
            response: aiResponse,
            chatId: chat ? chat._id : null,
            chat: chat || null,
        });

    } catch (error) {
        console.error("Error in AI Route:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "Failed to generate AI response"
        }, { status: 500 });
    }
}
