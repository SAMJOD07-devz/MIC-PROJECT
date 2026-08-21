import crypto from "crypto";
import QRCode from "qrcode";

export interface QrPayload {
  token: string;
  hash: string;
}

// 1. Generate Unique Server-Issued QR Payload for a Registration
export function generateRegistrationQrToken(eventId: string, attendeeId: string): QrPayload {
  const timestamp = Date.now();
  const randomSalt = crypto.randomBytes(16).toString("hex");
  const rawToken = `ORBIT-TICKET:${eventId}:${attendeeId}:${timestamp}:${randomSalt}`;
  const hash = hashQrToken(rawToken);

  return {
    token: rawToken,
    hash,
  };
}

// 2. Hash QR Token with SHA-256 for secure database lookup
export function hashQrToken(token: string): string {
  return crypto.createHash("sha256").update(token.trim()).digest("hex");
}

// 3. Generate Data URL (Base64 SVG/PNG image) for UI QR display
export async function renderQrCodeDataUrl(token: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(token, {
      errorCorrectionLevel: "H",
      margin: 2,
      color: {
        dark: "#0F172A", // Dark navy
        light: "#FFFFFF",
      },
    });
    return dataUrl;
  } catch (error) {
    console.error("QR Code generation error:", error);
    throw new Error("Failed to render QR Code DataURL");
  }
}
