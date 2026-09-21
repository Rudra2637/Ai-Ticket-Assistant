/**
 * Send email notification using nodemailer.
 * Lazy-loads nodemailer dynamically only if SMTP credentials are configured.
 * Gracefully skips if unconfigured, without crashing the server or requiring nodemailer in serverless.
 */
export const sendMail = async (to, subject, text) => {
    const host = process.env.MAILTRAP_SMTP_HOST || process.env.SMTP_HOST;
    const user = process.env.MAILTRAP_SMTP_USER || process.env.SMTP_USER;
    const pass = process.env.MAILTRAP_SMTP_PASS || process.env.SMTP_PASS;
    const port = process.env.MAILTRAP_SMTP_PORT || process.env.SMTP_PORT || 2525;

    // Skip silently if SMTP is not configured
    if (!host || !user || !pass) {
        return null;
    }

    try {
        const nodemailer = (await import('nodemailer')).default;
        const transporter = nodemailer.createTransport({
            host,
            port: Number(port),
            secure: Number(port) === 465,
            auth: { user, pass }
        });

        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM || 'AI Ticket Assistant <no-reply@ticketai.dev>',
            to,
            subject,
            text
        });
        console.log("[Mailer] Notification sent:", info.messageId);
        return info;
    } catch (error) {
        console.warn("[Mailer] Failed to send email notification:", error.message);
        return null;
    }
};