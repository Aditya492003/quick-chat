"use client";
import { useAppContext } from "@/context/AppContext";
import { useEffect, useState } from "react";

const formatTokenNum = (num) => {
    if (!num) return "0";
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return String(num);
};

const QuotaUsage = ({ expand }) => {
    const { quota } = useAppContext();
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        if (!quota || !quota.isResponseBlocked || !quota.responseBlockedUntil) {
            setTimeLeft("");
            return;
        }

        const updateTimer = () => {
            const now = Date.now();
            const target = new Date(quota.responseBlockedUntil).getTime();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft("00h 00m 00s");
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const pad = (n) => String(n).padStart(2, "0");
            setTimeLeft(`${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [quota]);

    if (!quota) return null;

    const chatPct = Math.min(100, Math.round((quota.chatsUsed / quota.chatsLimit) * 100));
    const tokenPct = Math.min(100, Math.round(((quota.tokensUsed || 0) / (quota.tokensLimit || 20000)) * 100));

    if (!expand) {
        return (
            <div className="group relative flex justify-center my-2 cursor-pointer">
                <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center border transition ${
                        quota.isResponseBlocked || quota.chatsUsed >= quota.chatsLimit
                            ? "bg-red-500/20 border-red-500/50 text-red-400"
                            : "bg-gray-800/80 border-gray-700/60 text-blue-400"
                    }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>

                <div className="absolute left-14 bottom-0 opacity-0 group-hover:opacity-100 transition bg-[#18191c] border border-gray-700 text-white text-xs p-3 rounded-xl shadow-2xl pointer-events-none z-50 w-60 space-y-2">
                    <p className="font-semibold text-gray-200 border-b border-gray-700 pb-1 flex justify-between items-center">
                        <span>Quota Limits</span>
                        <span className="text-[10px] text-blue-400 font-mono">GROQ AI</span>
                    </p>
                    <div>
                        <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                            <span>Chats Today</span>
                            <span className="font-medium text-white">{quota.chatsUsed} / {quota.chatsLimit}</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                            <div
                                className={`h-full transition-all ${
                                    chatPct >= 100 ? "bg-red-500" : chatPct >= 75 ? "bg-amber-400" : "bg-blue-500"
                                }`}
                                style={{ width: `${chatPct}%` }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                            <span>Token Usage (4h)</span>
                            <span className="font-medium text-white">
                                {formatTokenNum(quota.tokensUsed)} / {formatTokenNum(quota.tokensLimit)}
                            </span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                            <div
                                className={`h-full transition-all ${
                                    quota.isResponseBlocked ? "bg-red-500 animate-pulse" : tokenPct >= 80 ? "bg-amber-400" : "bg-purple-500"
                                }`}
                                style={{ width: `${tokenPct}%` }}
                            />
                        </div>
                    </div>

                    {quota.isResponseBlocked && (
                        <div className="pt-1 border-t border-red-500/30 text-red-400 text-[11px] flex items-center justify-between">
                            <span>⏳ Cooldown:</span>
                            <span className="font-mono font-semibold">{timeLeft}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="my-3 p-3 bg-[#1e2023] border border-gray-700/60 rounded-xl space-y-3 shadow-md">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3.5 h-3.5 text-blue-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Usage Quota
                </span>
                <span className="text-[10px] text-gray-400 bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">
                    Free Tier
                </span>
            </div>

            {/* Chat Creation Usage */}
            <div>
                <div className="flex justify-between text-xs text-gray-300 mb-1">
                    <span>Chats Created Today</span>
                    <span className="font-semibold">
                        {quota.chatsUsed} <span className="text-gray-500">/ {quota.chatsLimit}</span>
                    </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700/50">
                    <div
                        className={`h-full transition-all duration-500 ${
                            chatPct >= 100
                                ? "bg-gradient-to-r from-red-600 to-rose-500"
                                : chatPct >= 75
                                ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                                : "bg-gradient-to-r from-blue-600 to-cyan-400"
                        }`}
                        style={{ width: `${chatPct}%` }}
                    />
                </div>
                {quota.chatsUsed >= quota.chatsLimit && (
                    <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                        <span>⚠️ Daily chat limit reached (4/4)</span>
                    </p>
                )}
            </div>

            {/* Token Usage */}
            <div>
                <div className="flex justify-between text-xs text-gray-300 mb-1">
                    <span>Token Usage (4h)</span>
                    <span className="font-semibold">
                        {formatTokenNum(quota.tokensUsed)}{" "}
                        <span className="text-gray-500">/ {formatTokenNum(quota.tokensLimit)}</span>
                    </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700/50">
                    <div
                        className={`h-full transition-all duration-500 ${
                            quota.isResponseBlocked
                                ? "bg-gradient-to-r from-red-600 to-rose-500 animate-pulse"
                                : tokenPct >= 80
                                ? "bg-gradient-to-r from-amber-500 to-orange-400"
                                : "bg-gradient-to-r from-indigo-500 to-purple-500"
                        }`}
                        style={{ width: `${tokenPct}%` }}
                    />
                </div>
            </div>

            {/* 4-Hour Cooldown Banner */}
            {quota.isResponseBlocked && (
                <div className="p-2 bg-red-950/40 border border-red-500/40 rounded-lg text-red-300 text-xs flex flex-col gap-1 animate-pulse">
                    <div className="flex items-center gap-1.5 font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        4-Hour Cooldown Active
                    </div>
                    <div className="flex justify-between items-center font-mono text-[11px] text-red-200 pt-0.5">
                        <span>Time remaining:</span>
                        <span className="font-bold bg-red-900/60 px-1.5 py-0.5 rounded text-white border border-red-500/30">
                            {timeLeft}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuotaUsage;
