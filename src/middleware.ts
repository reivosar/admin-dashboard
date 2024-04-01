import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "./pages/api/utils/jwt";
import { isPathProtected } from "@/utils/authConfig";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (!url.pathname.includes("/api")) {
    return NextResponse.next();
  }

  if (!isPathProtected(url.pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("authToken");
  if (typeof token?.value === "string" && !isTokenValid(token.value)) {
    return NextResponse.next();
  } else {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

function isTokenValid(token: string): boolean {
  try {
    const decoded = verify(token);
    return decoded.valid;
  } catch (error) {
    return false;
  }
}
