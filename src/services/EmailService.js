const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
  }

  /**
   * Lazy-initialize transporter with timeouts and direct TLS (port 465)
   */
  getTransporter() {
    if (!this.transporter) {
      if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        throw new Error('SMTP_EMAIL and SMTP_PASSWORD environment variables are required');
      }

      const smtpPassword = process.env.SMTP_PASSWORD.replace(/\s+/g, ''); // strip spaces from app password

      this.transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // direct TLS connection (more reliable than STARTTLS on port 587)
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: smtpPassword,
        },
        connectionTimeout: 10000, // 10s to establish connection
        greetingTimeout: 10000,   // 10s for SMTP greeting
        socketTimeout: 15000,     // 15s for socket inactivity
        logger: process.env.NODE_ENV !== 'production', // log in dev
      });
    }
    return this.transporter;
  }

  /**
   * Generate a 6-digit numeric OTP
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP verification email
   */
  async sendOTP(email, otp, name) {
    const mailOptions = {
      from: `"Spark FitLife" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'Your Spark FitLife Verification Code',
      text: `Hi ${name},\n\nYour verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, please ignore this email.\n\n- Spark FitLife Team`,
      html: `
        <div style="max-width: 480px; margin: 0 auto; font-family: 'Segoe UI', Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #1E88E5 0%, #FF6D00 100%); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 24px;">⚡ Spark FitLife</h1>
          </div>
          <div style="background: #141414; padding: 32px; border-radius: 0 0 16px 16px; border: 1px solid #2a2a2a; border-top: none;">
            <p style="color: #e0e0e0; font-size: 16px; margin: 0 0 8px;">Hey <strong style="color: #FF6D00;">${name}</strong>,</p>
            <p style="color: #b0b0b0; font-size: 14px; margin: 0 0 24px;">Use the code below to verify your email and complete registration:</p>
            <div style="background: #1a1a2e; border: 2px solid #1E88E5; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
              <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #FF6D00;">${otp}</span>
            </div>
            <p style="color: #888; font-size: 13px; margin: 0 0 4px;">This code expires in <strong style="color: #e0e0e0;">10 minutes</strong>.</p>
            <p style="color: #888; font-size: 13px; margin: 0;">If you didn't request this, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #2a2a2a; margin: 24px 0;" />
            <p style="color: #555; font-size: 11px; text-align: center; margin: 0;">Spark FitLife - Ignite Your Fitness Journey</p>
          </div>
        </div>
      `,
    };

    const info = await this.getTransporter().sendMail(mailOptions);
    console.log('OTP email sent:', info.messageId, 'to:', email);
    return info;
  }
}

module.exports = new EmailService();
