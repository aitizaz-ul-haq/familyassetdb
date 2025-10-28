import nodemailer from "nodemailer";

export async function sendForgotPasswordEmail(username) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SUPERADMIN_EMAIL,
      subject: `Password Reset Request - Family Asset Database`,
      html: `
        <h2>Password Reset Request</h2>
        <p>A user has requested a password reset.</p>
        <p><strong>Username:</strong> ${username}</p>
        <p>Please contact the user to reset their password manually.</p>
        <hr>
        <p><small>This is an automated message from Family Asset Database</small></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
}
