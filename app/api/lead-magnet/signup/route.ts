import { NextResponse } from "next/server";
import { createLeadMagnetToken } from "@/lib/lead-magnet/token";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SignupPayload = {
  email?: string;
  firstName?: string;
  source?: string;
};

function resolveOrigin(request: Request): string {
  const explicitOrigin = process.env.NEXT_PUBLIC_SITE_URL;

  if (explicitOrigin) {
    return explicitOrigin.replace(/\/$/, "");
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host") ?? "localhost:3000";
  const protocol = request.headers.get("x-forwarded-proto") ?? "http";

  return `${protocol}://${host}`;
}

async function sendDeliveryWebhook(payload: {
  email: string;
  firstName?: string;
  source: string;
  downloadUrl: string;
}) {
  const webhookUrl = process.env.LEAD_MAGNET_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      attempted: false,
      queued: false,
    };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return {
      attempted: true,
      queued: response.ok,
    };
  } catch {
    return {
      attempted: true,
      queued: false,
    };
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as SignupPayload;

  const email = body.email?.trim().toLowerCase() ?? "";

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please provide a valid email address.",
      },
      {
        status: 400,
      },
    );
  }

  const source = body.source ?? "site";
  const secret = process.env.LEAD_MAGNET_SECRET ?? "dev-only-lead-magnet-secret";
  const token = createLeadMagnetToken(email, secret);

  const origin = resolveOrigin(request);
  const downloadUrl = `${origin}/api/lead-magnet/download?token=${encodeURIComponent(token)}`;

  const delivery = await sendDeliveryWebhook({
    email,
    firstName: body.firstName?.trim(),
    source,
    downloadUrl,
  });

  return NextResponse.json({
    ok: true,
    downloadUrl,
    delivery,
  });
}
