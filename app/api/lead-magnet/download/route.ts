import { NextResponse } from "next/server";
import { verifyLeadMagnetToken } from "@/lib/lead-magnet/token";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing token.",
      },
      {
        status: 400,
      },
    );
  }

  const secret = process.env.LEAD_MAGNET_SECRET ?? "dev-only-lead-magnet-secret";
  const payload = verifyLeadMagnetToken(token, secret);

  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        error: "Invalid or expired token.",
      },
      {
        status: 401,
      },
    );
  }

  const pdfUrl = new URL("/ebooks/catholic-theology-starter-guide.pdf", url.origin);
  return NextResponse.redirect(pdfUrl);
}
