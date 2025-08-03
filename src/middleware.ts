import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect API routes that modify data
  if (path.startsWith("/api/") && !path.startsWith("/api/auth")) {
    const token = await getToken({ req: request });
    
    // Allow GET requests for public data
    if (request.method === "GET") {
      return NextResponse.next();
    }

    // Require authentication for POST/PUT/DELETE
    if (!token && ["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};