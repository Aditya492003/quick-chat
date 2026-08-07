import connectDB from "@/config/db";
import User from "@/models/User";

export const MAX_CHATS_PER_DAY = 4;
export const CHAT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

export const MAX_TOKENS_PER_WINDOW = 20000; // 20,000 tokens
export const TOKEN_WINDOW_MS = 4 * 60 * 60 * 1000; // 4 hours
export const COOLDOWN_MS = 4 * 60 * 60 * 1000; // 4 hours cooldown

export async function getUserQuotaDoc(userId) {
    await connectDB();
    let user = await User.findById(userId);

    if (!user) {
        try {
            user = await User.create({
                _id: userId,
                name: "User",
                email: "",
                chatCount: 0,
                chatWindowStart: new Date(),
                tokensUsed: 0,
                tokenWindowStart: new Date(),
                responseBlockedUntil: null,
            });
        } catch (err) {
            user = await User.findById(userId);
        }
    }

    if (!user) {
        throw new Error(`Failed to find or initialize user with ID: ${userId}`);
    }

    const now = Date.now();
    let modified = false;

    if (user.chatCount === undefined || user.chatCount === null) {
        user.chatCount = 0;
        modified = true;
    }
    if (!user.chatWindowStart) {
        user.chatWindowStart = new Date(now);
        modified = true;
    }
    if (user.tokensUsed === undefined || user.tokensUsed === null) {
        user.tokensUsed = 0;
        modified = true;
    }
    if (!user.tokenWindowStart) {
        user.tokenWindowStart = new Date(now);
        modified = true;
    }

    // Check 24h chat creation window reset
    const chatStartMs = new Date(user.chatWindowStart).getTime();
    if (isNaN(chatStartMs) || now - chatStartMs >= CHAT_WINDOW_MS) {
        user.chatCount = 0;
        user.chatWindowStart = new Date(now);
        modified = true;
    }

    // Check 4h token window & blocked cooldown reset
    if (user.responseBlockedUntil) {
        const blockedUntilMs = new Date(user.responseBlockedUntil).getTime();
        if (isNaN(blockedUntilMs) || now >= blockedUntilMs) {
            user.responseBlockedUntil = null;
            user.tokensUsed = 0;
            user.tokenWindowStart = new Date(now);
            modified = true;
        }
    } else {
        const tokenStartMs = new Date(user.tokenWindowStart).getTime();
        if (isNaN(tokenStartMs) || now - tokenStartMs >= TOKEN_WINDOW_MS) {
            user.tokensUsed = 0;
            user.tokenWindowStart = new Date(now);
            modified = true;
        }
    }

    if (modified) {
        await user.save();
    }

    return user;
}

export function formatQuota(user) {
    const now = Date.now();
    const chatStartMs = user.chatWindowStart ? new Date(user.chatWindowStart).getTime() : now;
    const chatResetTime = new Date(chatStartMs + CHAT_WINDOW_MS).toISOString();

    const isBlocked = Boolean(
        user.responseBlockedUntil && new Date(user.responseBlockedUntil).getTime() > now
    );

    let tokenResetTime;
    if (isBlocked) {
        tokenResetTime = new Date(user.responseBlockedUntil).toISOString();
    } else {
        const tokenStartMs = user.tokenWindowStart ? new Date(user.tokenWindowStart).getTime() : now;
        tokenResetTime = new Date(tokenStartMs + TOKEN_WINDOW_MS).toISOString();
    }

    return {
        chatsUsed: user.chatCount || 0,
        chatsLimit: MAX_CHATS_PER_DAY,
        chatsRemaining: Math.max(0, MAX_CHATS_PER_DAY - (user.chatCount || 0)),
        chatResetTime,
        tokensUsed: user.tokensUsed || 0,
        tokensLimit: MAX_TOKENS_PER_WINDOW,
        tokensRemaining: Math.max(0, MAX_TOKENS_PER_WINDOW - (user.tokensUsed || 0)),
        tokenResetTime,
        isResponseBlocked: isBlocked,
        responseBlockedUntil: user.responseBlockedUntil ? new Date(user.responseBlockedUntil).toISOString() : null,
    };
}

export async function checkAndUpdateChatQuota(userId) {
    const user = await getUserQuotaDoc(userId);

    if (user.chatCount >= MAX_CHATS_PER_DAY) {
        return {
            allowed: false,
            error: `Daily chat creation limit reached (${MAX_CHATS_PER_DAY} chats/day).`,
            quota: formatQuota(user),
        };
    }

    user.chatCount = (user.chatCount || 0) + 1;
    await user.save();

    return {
        allowed: true,
        quota: formatQuota(user),
    };
}

export async function checkCanGenerateResponse(userId) {
    const user = await getUserQuotaDoc(userId);
    const now = Date.now();

    if (user.responseBlockedUntil && new Date(user.responseBlockedUntil).getTime() > now) {
        return {
            allowed: false,
            error: `Token limit reached (20,000 tokens/4h). 4-hour waiting period active.`,
            quota: formatQuota(user),
        };
    }

    if (user.tokensUsed >= MAX_TOKENS_PER_WINDOW) {
        user.responseBlockedUntil = new Date(now + COOLDOWN_MS);
        await user.save();
        return {
            allowed: false,
            error: `Token usage limit reached (20,000 tokens). 4-hour waiting period initiated.`,
            quota: formatQuota(user),
        };
    }

    return {
        allowed: true,
        quota: formatQuota(user),
    };
}

export async function recordTokenUsage(userId, tokensConsumed) {
    const user = await getUserQuotaDoc(userId);
    const now = Date.now();

    const addedTokens = Math.max(1, Math.round(tokensConsumed || 0));
    user.tokensUsed = (user.tokensUsed || 0) + addedTokens;

    if (user.tokensUsed >= MAX_TOKENS_PER_WINDOW && !user.responseBlockedUntil) {
        user.responseBlockedUntil = new Date(now + COOLDOWN_MS);
    }

    await user.save();
    return formatQuota(user);
}