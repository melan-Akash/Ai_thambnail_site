import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// A helper to wrap content in a beautiful HTML template
const getEmailHtml = (title: string, heading: string, contentHtml: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #0f172a;
          color: #f1f5f9;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #1e293b;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          border: 1px solid #334155;
        }
        .header {
          background: linear-gradient(135deg, #ec4899 0%, #6366f1 100%);
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          color: #ffffff;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        .content {
          padding: 40px 30px;
          line-height: 1.6;
          font-size: 16px;
          color: #cbd5e1;
        }
        .content h2 {
          color: #ffffff;
          font-size: 20px;
          margin-top: 0;
          margin-bottom: 20px;
        }
        .button-container {
          text-align: center;
          margin: 30px 0 10px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #ec4899 0%, #6366f1 100%);
          color: #ffffff !important;
          text-decoration: none;
          font-weight: 600;
          border-radius: 9999px;
          box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
        }
        .footer {
          background-color: #0f172a;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #64748b;
          border-top: 1px solid #334155;
        }
        hr {
          border: 0;
          border-top: 1px solid #334155;
          margin: 30px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thumblify</h1>
        </div>
        <div class="content">
          <h2>${heading}</h2>
          ${contentHtml}
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} Thumblify. All rights reserved.</p>
          <p>Making every customer feel valued—no matter the size of your audience.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendWelcomeEmail = async (to: string, name: string) => {
  const title = "Welcome to Thumblify!";
  const heading = `Hey ${name}, Welcome to Thumblify!`;
  const contentHtml = `
    <p>Thank you for joining Thumblify, the ultimate AI-powered YouTube thumbnail generator. We are thrilled to have you on board!</p>
    <p>We have credited your account with <strong>3 free generation credits</strong> to get you started immediately. You can start creating eye-catching, high-CTR thumbnails right away.</p>
    <div class="button-container">
      <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/generate" class="button">Create Your First Thumbnail</a>
    </div>
    <hr>
    <p>If you have any questions or need help, feel free to reply to this email. Our support team is always here for you.</p>
  `;

  const html = getEmailHtml(title, heading, contentHtml);

  try {
    await transporter.sendMail({
      from: `"Thumblify" <${process.env.EMAIL_USER}>`,
      to,
      subject: title,
      html,
    });
    console.log(`Welcome email sent to ${to}`);
  } catch (err) {
    console.error(`Failed to send welcome email to ${to}:`, err);
  }
};

export const sendPaymentEmail = async (to: string, name: string, planName: string, credits: number) => {
  const title = "Payment Confirmed - Credits Added!";
  const heading = `Thank you for your purchase, ${name}!`;
  const contentHtml = `
    <p>We have successfully processed your payment for the <strong>${planName} Plan</strong>.</p>
    <p><strong>${credits} credits</strong> have been added to your Thumblify account and are ready to use.</p>
    <div class="button-container">
      <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/generate" class="button">Go to Dashboard</a>
    </div>
    <hr>
    <p>Your support helps us keep improving Thumblify. We can't wait to see the amazing thumbnails you create!</p>
  `;

  const html = getEmailHtml(title, heading, contentHtml);

  try {
    await transporter.sendMail({
      from: `"Thumblify" <${process.env.EMAIL_USER}>`,
      to,
      subject: title,
      html,
    });
    console.log(`Payment confirmation email sent to ${to}`);
  } catch (err) {
    console.error(`Failed to send payment email to ${to}:`, err);
  }
};

export const sendContactEmail = async (senderName: string, senderEmail: string, message: string) => {
  const title = "New Contact Form Submission";
  const heading = `New Message from ${senderName}`;
  const contentHtml = `
    <p>You have received a new message from the Thumblify contact form:</p>
    <div style="background-color: #0f172a; padding: 20px; border-radius: 8px; border: 1px solid #334155; margin: 20px 0; color: #e2e8f0;">
      <p><strong>Name:</strong> ${senderName}</p>
      <p><strong>Email:</strong> ${senderEmail}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap; margin-top: 5px;">${message}</p>
    </div>
  `;

  const html = getEmailHtml(title, heading, contentHtml);

  try {
    await transporter.sendMail({
      from: `"Thumblify Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER || "melonakash2002@gmail.com",
      subject: `Thumblify Contact: ${senderName}`,
      replyTo: senderEmail,
      html,
    });
    console.log(`Contact email from ${senderEmail} forwarded to admin`);
  } catch (err) {
    console.error(`Failed to send contact email to admin:`, err);
  }
};
