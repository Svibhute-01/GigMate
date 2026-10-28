
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendOtpEmail(email, otp) {
    return transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: "GigMate — Email Verification OTP",
        text: `Your GigMate verification OTP is ${otp}. It expires in 10 minutes. Do not share this code with anyone.`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #ddd; border-radius: 12px;">
                <h2>Welcome to GigMate</h2>
                <p>Use the following OTP to verify your email address:</p>
                <h1 style="letter-spacing: 8px; text-align: center;">${otp}</h1>
                <p>This code expires in <strong>10 minutes</strong>.</p>
                <p>If you did not request this code, you can ignore this email.</p>
            </div>
        `,
    });
}
