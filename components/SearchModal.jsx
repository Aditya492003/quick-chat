"use client";
import { useAppContext } from "@/context/AppContext";
import { useEffect, useRef, useState } from "react";

const SearchModal = ({ isOpen, onClose }) => {
    const { chats, selectChat } = useAppContext();
    const [query, setQuery] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setQuery("");
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                if (isOpen) {
                    onClose();
                } else {
                    // Open search modal via custom event or prop
                    window.dispatchEvent(new CustomEvent("open-search-modal"));
                }
            } else if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const filteredChats = chats ? chats.filter((chat) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        const nameMatch = chat.name?.toLowerCase().includes(q);
        const msgMatch = chat.messages?.some((m) => m.content?.toLowerCase().includes(q));
        return nameMatch || msgMatch;
    }) : [];

    const handleSelectResult = (chat) => {
        selectChat(chat);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-16 md:pt-24 px-4 transition-all"
            onClick={onClose}
        >
            <div
                className="w-full max-w-xl bg-[#212327] border border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Bar Header */}
                <div className="flex items-center px-4 py-3 border-b border-gray-700/60 bg-[#18191c]">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search chats and messages... (Ctrl + K)"
                        className="w-full bg-transparent outline-none text-white text-sm placeholder-gray-400"
                    />
                    {query && (
                        <button
                            onClick={() => setQuery("")}
                            className="text-xs text-gray-400 hover:text-white px-2 py-1"
                        >
                            Clear
                        </button>
                    )}
                    <kbd className="hidden sm:inline-block text-[10px] text-gray-400 bg-gray-800 border border-gray-700 px-1.5 py-0.5 rounded font-mono ml-2">
                        ESC
                    </kbd>
                </div>

                {/* Search Results List */}
                <div className="overflow-y-auto p-2 divide-y divide-gray-800/60">
                    {filteredChats.length > 0 ? (
                        filteredChats.map((chat) => {
                            const matchingMsg = query.trim()
                                ? chat.messages?.find((m) => m.content?.toLowerCase().includes(query.toLowerCase()))
                                : chat.messages?.[chat.messages.length - 1];

                            return (
                                <div
                                    key={chat._id}
                                    onClick={() => handleSelectResult(chat)}
                                    className="p-3 hover:bg-gray-800/60 rounded-xl cursor-pointer transition flex flex-col gap-1 group"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-white group-hover:text-blue-400 transition truncate">
                                            {chat.name}
                                        </span>
                                        <span className="text-[10px] text-gray-500 font-mono">
                                            {chat.messages?.length || 0} msgs
                                        </span>
                                    </div>

                                    {matchingMsg && (
                                        <p className="text-xs text-gray-400 truncate line-clamp-1">
                                            <span className="text-gray-500 font-medium capitalize me-1">
                                                {matchingMsg.role}:
                                            </span>
                                            {matchingMsg.content}
                                        </p>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-12 text-center text-gray-400 text-xs">
                            No matching conversations found for "{query}".
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
