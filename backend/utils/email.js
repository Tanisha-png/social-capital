import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async ({ to, subject, html }) => {
    try {
        await transporter.sendMail({
            from: `"Social Capital" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
    } catch (err) {
        console.error("❌ Email send failed:", err.message);
        // IMPORTANT: do NOT throw — never break app flow
    }
};
