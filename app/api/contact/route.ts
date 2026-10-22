import { NextRequest, NextResponse } from "next/server";
import { SITE_CONFIG } from "@/lib/config";

interface ContactRequestPayload {
  name?: string;
  email?: string;
  category?: string;
  pageUrl?: string;
  message?: string;
  honeypot?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactRequestPayload;

    // 1. Honeypot anti-spam check
    if (body.honeypot && body.honeypot.trim().length > 0) {
      return NextResponse.json(
        { ok: true, mode: "filtered" },
        { status: 200 }
      );
    }

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const category = (body.category || "General Inquiry").trim();
    const pageUrl = (body.pageUrl || "").trim();
    const message = (body.message || "").trim();

    // 2. Server-side validation
    const errors: Record<string, string> = {};
    if (name.length < 2 || name.length > 100) {
      errors.name = "Please enter your name (2 to 100 characters).";
    }
    if (!EMAIL_REGEX.test(email) || email.length > 160) {
      errors.email = "Please enter a valid email address so we can reply.";
    }
    if (message.length < 15 || message.length > 4000) {
      errors.message =
        "Please enter a clear message between 15 and 4,000 characters.";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please correct the highlighted fields and try again.",
          fieldErrors: errors,
        },
        { status: 400 }
      );
    }

    // 3. Forward submission to medhastone@gmail.com via FormSubmit AJAX endpoint
    const recipient = SITE_CONFIG.formRecipientEmail;
    try {
      const forwardRes = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Origin: SITE_CONFIG.canonicalDomain,
            Referer: `${SITE_CONFIG.canonicalDomain}/contact`,
          },
          body: JSON.stringify({
            _subject: `[UnitConvertersGo] ${category} from ${name}`,
            name,
            email,
            topic: category,
            reference_url: pageUrl || "Not specified",
            message,
            _template: "table",
          }),
        }
      );

      if (forwardRes.ok) {
        const data = await forwardRes.json().catch(() => null);
        if (data && (data.success === "true" || data.success === true)) {
          return NextResponse.json({
            ok: true,
            mode: "delivered",
            recipientPublic: SITE_CONFIG.contactEmail,
          });
        }
      }
    } catch {
      // Network or relay restriction in sandboxed environment — fall back to mailto relay mode
    }

    // 4. Honest fallback response when direct relay requires email client dispatch
    return NextResponse.json({
      ok: true,
      mode: "mailto_fallback",
      recipientEmail: recipient,
      publicEmail: SITE_CONFIG.contactEmail,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "Unable to process your request. Please verify your inputs or email us directly.",
      },
      { status: 500 }
    );
  }
}
