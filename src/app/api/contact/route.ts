// Contact form send form submission handling
import * as nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { NextResponse } from "next/server";
import { rateLimit } from "@/utils/rateLimit";
import { getClientIp } from "@/utils/clientIp";

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(input: string) {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
    try {
        const ip = getClientIp(request.headers);

        const tooMany = (retryAfterSeconds?: number) =>
            NextResponse.json(
                { error: "Too many requests, please try again later." },
                {
                    status: 429,
                    headers: { "Retry-After": String(retryAfterSeconds ?? 60) },
                },
            );

        // 1) Per-IP: 5 requests per minute.
        const perIp = await rateLimit(5, 60_000, ip);
        if (!perIp.allowed) return tooMany(perIp.retryAfterSeconds);

        // 2) Global cap, independent of IP, so spoofed or rotating IPs still
        //    cannot flood the inbox: 30 messages per hour in total.
        const global = await rateLimit(30, 3_600_000, "global");
        if (!global.allowed) return tooMany(global.retryAfterSeconds);

        const raw = (await request.json()) as unknown;
        let name = "";
        let email = "";
        let message = "";

        if (typeof raw === "object" && raw !== null) {
            const body = raw as {
                name?: unknown;
                email?: unknown;
                message?: unknown;
            };

            if (typeof body.name === "string") name = body.name.trim();
            if (typeof body.email === "string") email = body.email.trim();
            if (typeof body.message === "string") message = body.message.trim();
        }

        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 },
            );
        }

        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email address" },
                { status: 400 },
            );
        }

        // Resolve SMTP config
        const host = (process.env.SMTP_HOST || "").trim();
        const port = Number(process.env.SMTP_PORT || 465);
        const secure = process.env.SMTP_SECURE === "true";
        const user = (process.env.SMTP_USER || "").trim();
        const pass = process.env.SMTP_PASSWORD || "";

        if (!host || !user || !pass) {
            console.error("Missing SMTP env values", {
                host: Boolean(host),
                user: Boolean(user),
                pass: Boolean(pass),
            });

            return NextResponse.json(
                { error: "SMTP configuration is missing or invalid" },
                { status: 500 },
            );
        }

        const effectiveSecure =
            port === 465 ? true : port === 587 ? false : secure;

        if (port === 465 && !secure) {
            console.warn("[contact] Forcing secure TLS for port 465");
        }

        if (port === 587 && secure) {
            console.warn("[contact] Disabling secure for port 587");
        }

        const transporter = nodemailer.createTransport({
            host: host as string,
            port,
            secure: effectiveSecure,
            auth: { user, pass },
            connectionTimeout: 15000,
            greetingTimeout: 15000,
            socketTimeout: 20000,
            family: 4,
        } as SMTPTransport.Options);


        // Email content - ensure ASCII-only envelope to avoid SMTPUTF8 requirement
        const hasNonASCII = (str: unknown): boolean =>
            /[^\x00-\x7F]/.test(String(str ?? ""));

        const envFrom = process.env.SMTP_FROM || process.env.SMTP_USER;
        const envTo = process.env.CONTACT_EMAIL || process.env.SMTP_USER;

        // Force ASCII envelope addresses
        const envelopeFrom = hasNonASCII(envFrom) ? process.env.SMTP_USER : envFrom;
        const envelopeTo = hasNonASCII(envTo) ? process.env.SMTP_USER : envTo;

        const safeName = escapeHtml(name);
        const safeEmail = escapeHtml(email);
        const safeMessage = escapeHtml(message).replace(/\n/g, "<br>");

        const mailOptions = {
            from: envFrom,
            to: envTo,
            envelope: {
                from: envelopeFrom as string,
                to: envelopeTo as string,
            },
            replyTo: `"${name.replace(/[\r\n"]/g, " ")}" <${email}>`,
            subject: `New Contact Form Submission from ${name}`,
            text: `Name: ${name} Email: ${email} Message: ${message}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
          </div>
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #007bff;">
            <h3 style="margin-top: 0; color: #333;">Message:</h3>
            <p style="line-height: 1.6; color: #555;">${safeMessage}</p>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #888; font-size: 12px;">
            This email was sent from your website's contact form.
          </p>
        </div>
      `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { message: "Message sent successfully" },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error sending contact form email:", error);

        const isProd = process.env.NODE_ENV === "production";
        const err = error as
            | { code?: unknown; message?: unknown }
            | null
            | undefined;
        const code = typeof err?.code === "string" ? err!.code : undefined;
        const messageStr = typeof err?.message === "string" ? err!.message : "";

        // Only expose diagnostics outside production; never leak SMTP details to clients.
        return NextResponse.json(
            {
                error: "Failed to send message",
                details: isProd ? undefined : { code, message: messageStr },
            },
            { status: 500 },
        );
    }
}