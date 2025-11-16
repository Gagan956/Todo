import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  process.exit(1);
}

const transporter = nodemailer.createTransport(emailConfig);

export const verifyEmailConnection = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    return true;
  } catch {
    return false;
  }
};

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: {
        name: process.env.EMAIL_FROM_NAME || 'Todo App',
        address: process.env.EMAIL_FROM_ADDRESS || process.env.SMTP_USER!,
      },
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });
  } catch (error: any) {
    if (error.code === 'EAUTH') {
      throw new Error(
        'Email authentication failed. Use App Password instead of your Gmail password.'
      );
    }

    if (error.code === 'ECONNECTION') {
      throw new Error('Cannot connect to email server. Check SMTP host/port.');
    }

    throw new Error(`Failed to send email: ${error.message}`);
  }
};

//  Send Welcome Email
export const sendWelcomeEmail = async (email: string, name: string) => {
  const html = `
  <div style="font-family: Arial; padding: 20px;">
    <h2 style="color:#4F46E5;">Welcome to Todo App</h2>
    <p>Hello ${name}, your account has been created successfully.</p>
    <p>Start managing your tasks now.</p>
    <a href="${process.env.FRONTEND_URL}" 
       style="padding:10px 20px;background:#4F46E5;color:#fff;text-decoration:none;border-radius:4px;">
       Open App
    </a>
  </div>
`;

  const text = `
Welcome to Todo App
Hello ${name}, your account has been created successfully.
Open App: ${process.env.FRONTEND_URL}
`;

  await sendEmail(email, 'Welcome to Todo App', html, text);
};

// Reset Password Email
export const sendResetPasswordEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const html = `
  <div style="font-family: Arial; padding: 20px;">
    <h2 style="color:#DC2626;">Reset Your Password</h2>
    <p>Click the button below to reset your password.</p>
    <a href="${resetUrl}" 
       style="padding:10px 20px;background:#DC2626;color:#fff;text-decoration:none;border-radius:4px;">
      Reset Password
    </a>
    <p style="margin-top:20px;">If the button doesn't work, open this link:</p>
    <p>${resetUrl}</p>
  </div>
`;

  const text = `
Reset Your Password
Reset link: ${resetUrl}
`;

  await sendEmail(email, 'Reset Your Password', html, text);
};

// password Updated Email 
export const sendPasswordChangedEmail = async (email: string, name: string) => {
  const html = `
  <div style="font-family: Arial; padding: 20px;">
    <h2 style="color:#059669;">Password Updated</h2>
    <p>Hello ${name}, your password has been changed successfully.</p>
    <p>If you didn't make this change, please contact support immediately.</p>
  </div>
`;

  const text = `
Your password was updated successfully.
If this wasn't you, contact support immediately.
`;

  await sendEmail(email, 'Your Password Was Updated', html, text);
};

export default {
  sendEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendPasswordChangedEmail,
  verifyEmailConnection,
};
