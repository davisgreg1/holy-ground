import { createHmac, timingSafeEqual } from "node:crypto";

type LeadMagnetTokenPayload = {
  email: string;
  exp: number;
};

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function createSignature(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createLeadMagnetToken(
  email: string,
  secret: string,
  ttlSeconds = 24 * 60 * 60,
): string {
  const payload: LeadMagnetTokenPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = createSignature(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export function verifyLeadMagnetToken(
  token: string,
  secret: string,
): LeadMagnetTokenPayload | null {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = createSignature(encodedPayload, secret);

  const provided = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (provided.length !== expected.length) {
    return null;
  }

  if (!timingSafeEqual(provided, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as LeadMagnetTokenPayload;

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    if (!payload.email) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
