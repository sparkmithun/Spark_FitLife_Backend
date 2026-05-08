const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

class EmailService {
  /**
   * Generate a 6-digit numeric OTP
   */
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send OTP verification email via Resend HTTP API
   */
  async sendOTP(email, otp, name) {
    try {
      const response = await resend.emails.send({
        from: 'Spark FitLife <noreply@sparkfitlife.online>',
        to: email,
        subject: 'Your Spark FitLife Verification Code',
        text: `Hi ${name},\n\nYour verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, please ignore this email.\n\n- Spark FitLife Team`,
        html: `
          <div style="max-width:480px;margin:0 auto;font-family:Arial,sans-serif;">
            <div style="background:linear-gradient(135deg,#1E88E5,#FF6D00);padding:32px;border-radius:16px 16px 0 0;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;">Spark FitLife</h1>
            </div>
            <div style="background:#141414;padding:32px;border-radius:0 0 16px 16px;border:1px solid #2a2a2a;border-top:none;">
              <p style="color:#e0e0e0;font-size:16px;margin:0 0 8px;">Hey <strong style="color:#FF6D00;">${name}</strong>,</p>
              <p style="color:#b0b0b0;font-size:14px;margin:0 0 24px;">Use the code below to verify your email:</p>
              <div style="background:#1a1a2e;border:2px solid #1E88E5;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
                <span style="font-size:36px;font-weight:800;letter-spacing:8px;color:#FF6D00;">${otp}</span>
              </div>
              <p style="color:#888;font-size:13px;margin:0;">This code expires in 10 minutes.</p>
            </div>
          </div>
        `,
      });

      console.log('Email sent via Resend:', response);
      return response;
    } catch (err) {
      console.error('Error sending email via Resend:', err);
      throw err;
    }
  }
}

module.exports = new EmailService();
