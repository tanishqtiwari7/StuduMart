const nodemailer = require("nodemailer");

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send generic email
 */
const sendEmail = async (options) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"StuduMart" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.text, // Reusing text field for HTML for simplicity in this helper
  };

  await transporter.sendMail(mailOptions);
};

/**
 * Send OTP email for verification
 * @param {string} to - Recipient email
 * @param {string} otp - OTP code
 * @param {string} name - User's name
 */
const sendOTPEmail = async (to, otp, name) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"StuduMart" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify Your Email - StuduMart",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #0a0a38 0%, #1e1e50 100%); border-radius: 16px; padding: 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0 0 10px 0; font-size: 28px;">StuduMart</h1>
            <p style="color: #a5b4fc; margin: 0; font-size: 14px;">Your College Marketplace</p>
          </div>
          
          <div style="background: #ffffff; border-radius: 16px; padding: 40px; margin-top: -20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <h2 style="color: #0f172a; margin: 0 0 20px 0; font-size: 24px;">Hey ${name}! 👋</h2>
            <p style="color: #64748b; margin: 0 0 30px 0; line-height: 1.6;">
              Welcome to StuduMart! To complete your registration, please use the verification code below:
            </p>
            
            <div style="background: #f1f5f9; border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px;">
              <p style="color: #64748b; margin: 0 0 10px 0; font-size: 14px;">Your verification code is:</p>
              <div style="font-size: 36px; font-weight: bold; color: #0a0a38; letter-spacing: 8px; font-family: monospace;">
                ${otp}
              </div>
              <p style="color: #94a3b8; margin: 15px 0 0 0; font-size: 12px;">
                This code expires in 10 minutes
              </p>
            </div>
            
            <p style="color: #64748b; margin: 0; line-height: 1.6; font-size: 14px;">
              If you didn't create an account on StuduMart, you can safely ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; padding: 30px 20px;">
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">
              © ${new Date().getFullYear()} StuduMart. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("OTP Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send verification email");
  }
};

/**
 * Generate a random 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send welcome email after successful verification
 */
const sendWelcomeEmail = async (to, name) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"StuduMart" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to StuduMart! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to StuduMart</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: linear-gradient(135deg, #0a0a38 0%, #1e1e50 100%); border-radius: 16px; padding: 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to StuduMart! 🎉</h1>
          </div>
          
          <div style="background: #ffffff; border-radius: 16px; padding: 40px; margin-top: -20px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <h2 style="color: #0f172a; margin: 0 0 20px 0;">Hey ${name}!</h2>
            <p style="color: #64748b; line-height: 1.6;">
              Your email has been verified successfully. You're now part of the StuduMart community!
            </p>
            <p style="color: #64748b; line-height: 1.6;">
              Here's what you can do:
            </p>
            <ul style="color: #64748b; line-height: 2;">
              <li>🛒 Buy and sell items with fellow students</li>
              <li>📅 Discover and RSVP to campus events</li>
              <li>🎭 Join clubs and get exclusive badges</li>
            </ul>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent to:", to);
  } catch (error) {
    console.error("Welcome email failed:", error);
    // Don't throw - welcome email is not critical
  }
};

module.exports = {
  sendOTPEmail,
  generateOTP,
  sendWelcomeEmail,
  sendEmail
};
