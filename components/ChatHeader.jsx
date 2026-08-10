"use client";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";
import toast from "react-hot-toast";

const ChatHeader = ({ onOpenSearch }) => {
    const { currentChat, messages } = useAppContext();
    const [showExportMenu, setShowExportMenu] = useState(false);

    if (!currentChat || !messages || messages.length === 0) {
        return (
            <div className="w-full max-w-3xl flex items-center justify-between py-2 px-4 mb-2">
                <span className="text-xs text-gray-400 font-medium">Quick Chat</span>
                <button
                    onClick={onOpenSearch}
                    className="flex items-center gap-1.5 text-xs text-gray-300 bg-[#34353a] hover:bg-[#3d3e44] px-3 py-1.5 rounded-full border border-gray-700/60 transition cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search (Ctrl + K)
                </button>
            </div>
        );
    }

    const handleShare = () => {
        if (!currentChat?._id) return;
        const shareUrl = `${window.location.origin}/share/${currentChat._id}`;
        navigator.clipboard.writeText(shareUrl);
        toast.success("Share link copied to clipboard!");
    };

    const exportAsMarkdown = () => {
        let mdContent = `# ${currentChat.name || "Conversation"}\n\n`;
        messages.forEach((msg) => {
            const roleName = msg.role === "user" ? "User" : "Quick Chat AI";
            mdContent += `### ${roleName}\n${msg.content}\n\n---\n\n`;
        });

        const blob = new Blob([mdContent], { type: "text/markdown;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${(currentChat.name || "chat").replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
        link.click();
        URL.revokeObjectURL(url);
        setShowExportMenu(false);
        toast.success("Exported as Markdown (.md)");
    };

    const exportAsJson = () => {
        const jsonContent = JSON.stringify(currentChat, null, 2);
        const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${(currentChat.name || "chat").replace(/[^a-z0-9]/gi, "_").toLowerCase()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        setShowExportMenu(false);
        toast.success("Exported as JSON (.json)");
    };

    return (
        <div className="w-full max-w-3xl flex items-center justify-between py-2 px-4 mb-2 border-b border-gray-700/40 relative z-30">
            <h2 className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-xs">
                {currentChat.name || "Untitled Chat"}
            </h2>

            <div className="flex items-center gap-2">
                {/* Search Button */}
                <button
                    onClick={onOpenSearch}
                    className="flex items-center gap-1.5 text-xs text-gray-300 bg-[#34353a] hover:bg-[#3d3e44] px-2.5 py-1.5 rounded-lg border border-gray-700/60 transition cursor-pointer"
                    title="Search messages (Ctrl + K)"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span className="hidden sm:inline">Search</span>
                </button>

                {/* Share Button */}
                <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 text-xs text-blue-300 bg-blue-600/20 hover:bg-blue-600/30 px-2.5 py-1.5 rounded-lg border border-blue-500/40 transition cursor-pointer"
                    title="Share chat"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span>Share</span>
                </button>

                {/* Export Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowExportMenu(!showExportMenu)}
                        className="flex items-center gap-1.5 text-xs text-gray-300 bg-[#34353a] hover:bg-[#3d3e44] px-2.5 py-1.5 rounded-lg border border-gray-700/60 transition cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Export</span>
                    </button>

                    {showExportMenu && (
                        <div className="absolute right-0 mt-2 w-44 bg-[#1e2023] border border-gray-700 rounded-xl shadow-xl py-1 z-50 text-xs">
                            <button
                                onClick={exportAsMarkdown}
                                className="w-full text-left px-3 py-2 text-gray-200 hover:bg-gray-700/60 flex items-center gap-2 cursor-pointer"
                            >
                                <span className="font-mono text-blue-400 font-bold">.MD</span>
                                Export as Markdown
                            </button>
                            <button
                                onClick={exportAsJson}
                                className="w-full text-left px-3 py-2 text-gray-200 hover:bg-gray-700/60 flex items-center gap-2 cursor-pointer"
                            >
                                <span className="font-mono text-amber-400 font-bold">.JSON</span>
                                Export as JSON
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
