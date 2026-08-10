"use client";
import { assets } from "@/assets/assets";
import Message from "@/components/Message";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";

export default function SharedChatPage({ params }) {
    const { id } = use(params);
    const [chat, setChat] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        const fetchSharedChat = async () => {
            try {
                const res = await axios.get(`/api/chat/share?id=${id}`);
                if (res.data.success) {
                    setChat(res.data.chat);
                } else {
                    setError(res.data.message || "Failed to load chat");
                }
            } catch (err) {
                setError("Conversation not found or link has expired");
            } finally {
                setLoading(false);
            }
        };
        fetchSharedChat();
    }, [id]);

    return (
        <div className="min-h-screen bg-[#292a2d] text-white flex flex-col items-center">
            {/* Header */}
            <header className="w-full border-b border-gray-700/60 bg-[#212327] px-6 py-4 flex items-center justify-between shadow-md">
                <Link href="/" className="flex items-center gap-3">
                    <Image src={assets.logo} alt="Quick Chat" className="w-32 md:w-36" />
                </Link>
                <Link
                    href="/"
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-full transition shadow-lg"
                >
                    Start New Chat
                </Link>
            </header>

            {/* Main Content */}
            <main className="w-full max-w-3xl flex-1 px-4 py-8 overflow-y-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                        <p className="text-sm">Loading shared conversation...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 max-w-md">
                            <p className="font-semibold text-sm mb-1">Shared Link Error</p>
                            <p className="text-xs text-gray-300">{error}</p>
                        </div>
                        <Link
                            href="/"
                            className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-4 py-2 rounded-xl transition"
                        >
                            Go to Quick Chat Home
                        </Link>
                    </div>
                ) : (
                    <div>
                        <div className="mb-6 pb-4 border-b border-gray-700/50 flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-semibold text-white tracking-tight">{chat.name}</h1>
                                <p className="text-xs text-gray-400 mt-1">Shared conversation • Read-only preview</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {chat.messages && chat.messages.length > 0 ? (
                                chat.messages.map((msg, index) => (
                                    <Message key={index} role={msg.role} content={msg.content} />
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-10 text-sm">No messages in this chat.</p>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
