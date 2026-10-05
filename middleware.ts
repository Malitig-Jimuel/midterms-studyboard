import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { rateLimit } from "./lib/rate-limit";

const LIMIT = 5;
const WINDOW_MS = 60_000;

export function middleware(request: NextRequest) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const key = `${ip}:${request.nextUrl.pathname}`

    const {success, remaining} = rateLimit(key, LIMIT, WINDOW_MS)

    if ( !success ){
        return NextResponse.json(
            { error: "Too many request, please try again later"},
            { status: 429 }
        );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Remaining", String(remaining))
    return response;
}

export const config = {
    matcher: [
        "/api/register",
        "/api/auth/callback/credentials"
    ],
};