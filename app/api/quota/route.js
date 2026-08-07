import { formatQuota, getUserQuotaDoc } from "@/config/quota";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "User not authenticated",
            }, { status: 401 });
        }

        const userDoc = await getUserQuotaDoc(userId);
        const quota = formatQuota(userDoc);

        return NextResponse.json({
            success: true,
            quota,
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
