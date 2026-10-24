"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  Mail,
  Send,
  Copy,
  Check,
  ShieldCheck,
} from "lucide-react";
import { SITE_CONFIG } from "@/lib/config";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  general?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "Formula or Calculation Discrepancy",
    pageUrl: "",
    message: "",
    honeypot: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<
    "idle" | "delivered" | "mailto_fallback"
  >("idle");
  const [copied, setCopied] = useState(false);

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (trimmedName.length < 2) {
      nextErrors.name = "Please enter your name (at least 2 characters).";
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      nextErrors.email =
        "Please enter a valid email address (e.g., name@example.com).";
    }
    if (trimmedMessage.length < 15) {
      nextErrors.message =
        "Please include at least 15 characters describing your question, unit request, or calculation details.";
    }
    return nextErrors;
  };

  const buildMailtoHref = (targetEmail: string) => {
    const subject = `[UnitConvertersGo] ${formData.category} — ${formData.name.trim()}`;
    const bodyLines = [
      `Name: ${formData.name.trim()}`,
      `Reply-To Email: ${formData.email.trim()}`,
      `Topic: ${formData.category}`,
      ...(formData.pageUrl.trim()
        ? [`Converter URL / Unit Pair: ${formData.pageUrl.trim()}`]
        : []),
      "",
      "Message:",
      formData.message.trim(),
    ];
    return `mailto:${targetEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
  };

  const handleCopyFormattedMessage = async () => {
    const text = [
      `To: ${SITE_CONFIG.formRecipientEmail} (${SITE_CONFIG.contactEmail})`,
      `From: ${formData.name.trim()} <${formData.email.trim()}>`,
      `Topic: ${formData.category}`,
      ...(formData.pageUrl.trim()
        ? [`Reference URL: ${formData.pageUrl.trim()}`]
        : []),
      "",
      formData.message.trim(),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Ignore clipboard failures
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrors({
          ...(data.fieldErrors || {}),
          general:
            data.error ||
            "Could not validate your message. Please review the fields below.",
        });
        setIsSubmitting(false);
        return;
      }

      if (data.mode === "delivered") {
        setSubmitState("delivered");
      } else {
        setSubmitState("mailto_fallback");
      }
    } catch {
      setSubmitState("mailto_fallback");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitState !== "idle") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="p-6 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-[#F7F9FC] dark:bg-slate-900 space-y-5"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#0D9488]/15 text-[#0D9488] dark:text-[#2DD4BF] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-[#16324F] dark:text-white">
              {submitState === "delivered"
                ? "Message Dispatched to Our Team"
                : "Message Validated & Ready to Send"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {submitState === "delivered" ? (
                <>
                  Thank you, <span className="font-semibold">{formData.name}</span>. Your{" "}
                  <span className="font-semibold">{formData.category}</span> message has been routed to our review inbox. If you also want a copy in your own sent mail folder, you can open it directly in your email client below.
                </>
              ) : (
                <>
                  Your inquiry has been validated. To guarantee immediate delivery from your browser without requiring third-party tracking scripts, click below to send your pre-formatted message directly to our inbox or copy the details.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 p-4 text-xs space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-semibold text-[#16324F] dark:text-slate-200">
              Topic: {formData.category}
            </span>
            <span className="text-slate-500">
              Public Contact:{" "}
              <strong className="text-[#0D9488] dark:text-[#2DD4BF]">
                {SITE_CONFIG.contactEmail}
              </strong>
            </span>
          </div>
          {formData.pageUrl && (
            <div className="text-slate-500 font-mono text-[11px] truncate">
              Reference URL: {formData.pageUrl}
            </div>
          )}
          <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed line-clamp-4">
            {formData.message}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={buildMailtoHref(SITE_CONFIG.formRecipientEmail)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0D9488] hover:bg-[#0F766E] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            <Mail className="w-4 h-4" />
            <span>Open in Email Client to Confirm Delivery</span>
          </a>

          <button
            type="button"
            onClick={handleCopyFormattedMessage}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#16324F] dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#0D9488] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#0D9488]" />
                <span>Copied Message</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Formatted Message</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setSubmitState("idle");
              setFormData({
                name: "",
                email: "",
                category: "Formula or Calculation Discrepancy",
                pageUrl: "",
                message: "",
                honeypot: "",
              });
            }}
            className="text-xs font-semibold text-slate-500 hover:text-[#16324F] dark:hover:text-white underline cursor-pointer ml-auto"
          >
            Write another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="p-6 sm:p-7 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5 shadow-2xs"
      aria-labelledby="contact-form-heading"
    >
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-1">
        <h2
          id="contact-form-heading"
          className="text-lg font-extrabold tracking-tight text-[#16324F] dark:text-white"
        >
          Send a Message or Report a Calculation Issue
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          All fields marked with <span className="text-rose-600 font-bold">*</span> are required. Or email us directly at{" "}
          <a
            href={`mailto:${SITE_CONFIG.contactEmail}`}
            className="font-semibold text-[#0D9488] dark:text-[#2DD4BF] hover:underline"
          >
            {SITE_CONFIG.contactEmail}
          </a>
          .
        </p>
      </div>

      {errors.general && (
        <div
          role="alert"
          className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* Hidden Honeypot Field for Anti-Spam */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-website-url">
          Leave this field empty if you are human
        </label>
        <input
          id="contact-website-url"
          name="website_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={formData.honeypot}
          onChange={(e) =>
            setFormData({ ...formData, honeypot: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-xs font-bold text-[#16324F] dark:text-slate-200 mb-1.5"
          >
            Your Name <span className="text-rose-600">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            placeholder="e.g., Alex Rivera"
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[#F7F9FC] dark:bg-slate-950 text-[#16324F] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.name
                ? "border-rose-400 focus:ring-rose-500/30"
                : "border-slate-200/90 dark:border-slate-700 focus:border-[#0D9488] focus:ring-[#0D9488]/20"
            }`}
          />
          {errors.name && (
            <p
              id="contact-name-error"
              role="alert"
              className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400"
            >
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="block text-xs font-bold text-[#16324F] dark:text-slate-200 mb-1.5"
          >
            Email Address <span className="text-rose-600">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            placeholder="alex@example.com"
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[#F7F9FC] dark:bg-slate-950 text-[#16324F] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.email
                ? "border-rose-400 focus:ring-rose-500/30"
                : "border-slate-200/90 dark:border-slate-700 focus:border-[#0D9488] focus:ring-[#0D9488]/20"
            }`}
          />
          {errors.email && (
            <p
              id="contact-email-error"
              role="alert"
              className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400"
            >
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="contact-category"
            className="block text-xs font-bold text-[#16324F] dark:text-slate-200 mb-1.5"
          >
            Subject / Inquiry Type <span className="text-rose-600">*</span>
          </label>
          <select
            id="contact-category"
            name="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200/90 dark:border-slate-700 bg-[#F7F9FC] dark:bg-slate-950 text-[#16324F] dark:text-white focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 cursor-pointer"
          >
            <option value="Formula or Calculation Discrepancy">
              Formula or Calculation Discrepancy
            </option>
            <option value="Request New Unit or Converter">
              Request New Unit or Converter
            </option>
            <option value="Technical Bug or Display Issue">
              Technical Bug or Display Issue
            </option>
            <option value="Widget Embed Support">
              Widget Embed Support
            </option>
            <option value="Privacy or Legal Inquiry">
              Privacy or Legal Inquiry
            </option>
            <option value="General Feedback">General Feedback</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="contact-page-url"
            className="block text-xs font-bold text-[#16324F] dark:text-slate-200 mb-1.5"
          >
            Affected Converter or URL{" "}
            <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            id="contact-page-url"
            name="pageUrl"
            type="text"
            value={formData.pageUrl}
            onChange={(e) =>
              setFormData({ ...formData, pageUrl: e.target.value })
            }
            placeholder="e.g., /convert/cm-to-inches or bar to psi"
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200/90 dark:border-slate-700 bg-[#F7F9FC] dark:bg-slate-950 text-[#16324F] dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0D9488] focus:ring-2 focus:ring-[#0D9488]/20 transition-colors"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-xs font-bold text-[#16324F] dark:text-slate-200 mb-1.5"
        >
          Message Details <span className="text-rose-600">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? "contact-message-error" : "contact-message-hint"
          }
          value={formData.message}
          onChange={(e) => {
            setFormData({ ...formData, message: e.target.value });
            if (errors.message) setErrors({ ...errors, message: undefined });
          }}
          placeholder="If reporting a calculation discrepancy, please include the input value, source unit, target unit, and the expected result..."
          className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-[#F7F9FC] dark:bg-slate-950 text-[#16324F] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
            errors.message
              ? "border-rose-400 focus:ring-rose-500/30"
              : "border-slate-200/90 dark:border-slate-700 focus:border-[#0D9488] focus:ring-[#0D9488]/20"
          }`}
        />
        {errors.message ? (
          <p
            id="contact-message-error"
            role="alert"
            className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400"
          >
            {errors.message}
          </p>
        ) : (
          <p
            id="contact-message-hint"
            className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400"
          >
            Minimum 15 characters. Please do not include sensitive personal or financial information.
          </p>
        )}
      </div>

      <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
          <span>
            Protected by honeypot anti-spam validation. See our{" "}
            <Link
              href="/privacy-policy"
              className="underline hover:text-[#0D9488]"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[#16324F] hover:bg-[#0D9488] dark:bg-[#0D9488] dark:hover:bg-[#0F766E] disabled:opacity-60 rounded-xl transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488]"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? "Validating & Sending..." : "Send Message"}</span>
        </button>
      </div>
    </form>
  );
}
