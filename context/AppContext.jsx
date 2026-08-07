"use client";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
};

export const AppContextProvider = ({ children }) => {
    const { user, isLoaded } = useUser();

    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeepThink, setIsDeepThink] = useState(false);
    const [quota, setQuota] = useState(null);

    const fetchChats = async () => {
        if (!user) return;
        try {
            const res = await axios.get("/api/chat/get");
            if (res.data.success) {
                setChats(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch chats:", error);
        }
    };

    const fetchQuota = async () => {
        if (!user) return;
        try {
            const res = await axios.get("/api/quota");
            if (res.data.success) {
                setQuota(res.data.quota);
            }
        } catch (error) {
            console.error("Failed to fetch quota:", error);
        }
    };

    useEffect(() => {
        if (isLoaded && user) {
            fetchChats();
            fetchQuota();
        } else if (isLoaded && !user) {
            setChats([]);
            setCurrentChat(null);
            setMessages([]);
            setQuota(null);
        }
    }, [user, isLoaded]);

    const startNewChat = async () => {
        if (quota && quota.chatsUsed >= quota.chatsLimit) {
            toast.error(`Daily chat creation limit reached (4 chats/day)`);
            return null;
        }

        try {
            if (user) {
                const res = await axios.post("/api/chat/create");
                if (res.data.success) {
                    const newChat = res.data.chat;
                    setChats((prev) => [newChat, ...prev]);
                    setCurrentChat(newChat);
                    setMessages([]);
                    if (res.data.quota) setQuota(res.data.quota);
                    return newChat;
                }
            } else {
                setCurrentChat(null);
                setMessages([]);
            }
        } catch (error) {
            console.error("Error creating chat:", error);
            if (error.response?.data?.rateLimited) {
                toast.error(error.response.data.message || "Daily chat creation limit reached (4 chats/day)");
                if (error.response.data.quota) setQuota(error.response.data.quota);
            } else {
                toast.error("Error creating chat");
            }
            setCurrentChat(null);
            setMessages([]);
        }
    };

    const selectChat = (chat) => {
        setCurrentChat(chat);
        setMessages(chat?.messages || []);
    };

    const sendMessage = async (promptText) => {
        if (!promptText || !promptText.trim()) return;

        if (quota && quota.isResponseBlocked) {
            toast.error("Response limit reached. 4-hour waiting time active.");
            return;
        }

        const userMsg = { role: "user", content: promptText, timestamp: Date.now() };
        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const res = await axios.post("/api/chat/ai", {
                chatId: currentChat ? currentChat._id : null,
                prompt: promptText,
                isDeepThink,
            });

            if (res.data.success) {
                const aiMsg = { role: "assistant", content: res.data.response, timestamp: Date.now() };
                setMessages((prev) => [...prev, aiMsg]);

                if (res.data.chat) {
                    setCurrentChat(res.data.chat);
                    setChats((prev) => {
                        const exists = prev.some((c) => c._id === res.data.chat._id);
                        if (exists) {
                            return prev.map((c) => (c._id === res.data.chat._id ? res.data.chat : c));
                        } else {
                            return [res.data.chat, ...prev];
                        }
                    });
                }

                if (res.data.quota) {
                    setQuota(res.data.quota);
                }
            } else {
                toast.error(res.data.error || "Failed to generate response");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            if (error.response?.data?.rateLimited) {
                toast.error(error.response.data.error || "Response limit reached. 4-hour waiting time active.");
                if (error.response.data.quota) setQuota(error.response.data.quota);
            } else {
                toast.error("Failed to connect to AI server");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renameChat = async (chatId, newName) => {
        try {
            const res = await axios.post("/api/chat/rename", { chatId, name: newName });
            if (res.data.success) {
                setChats((prev) => prev.map((c) => (c._id === chatId ? { ...c, name: newName } : c)));
                if (currentChat && currentChat._id === chatId) {
                    setCurrentChat((prev) => ({ ...prev, name: newName }));
                }
                toast.success("Chat renamed");
            }
        } catch (error) {
            console.error("Error renaming chat:", error);
            toast.error("Failed to rename chat");
        }
    };

    const deleteChat = async (chatId) => {
        try {
            const res = await axios.post("/api/chat/delete", { chatId });
            if (res.data.success) {
                setChats((prev) => prev.filter((c) => c._id !== chatId));
                if (currentChat && currentChat._id === chatId) {
                    setCurrentChat(null);
                    setMessages([]);
                }
                toast.success("Chat deleted");
            }
        } catch (error) {
            console.error("Error deleting chat:", error);
            toast.error("Failed to delete chat");
        }
    };

    const value = {
        user,
        chats,
        currentChat,
        messages,
        isLoading,
        isDeepThink,
        setIsDeepThink,
        quota,
        fetchQuota,
        fetchChats,
        startNewChat,
        selectChat,
        sendMessage,
        renameChat,
        deleteChat,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};