const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  SMTP_FROMNAME,
  SMTP_FROMEMAIL,
} = process.env;
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT, // 587, 25
  secure: SMTP_SECURE === "true", // true for port 465, false for other ports
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
  tls: {
  rejectUnauthorized: false,
}
});
module.exports = async (to, subject, message) => {
  try {
    const info = await transporter.sendMail({
      from: `"${SMTP_FROMNAME}" <${SMTP_FROMEMAIL}>`,
      to,
      subject,
      html: message,
    });

    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw {
      status: 500,
      message:
        "Không gửi được email. Vui lòng kiểm tra cấu hình hoặc App Password.",
      error,
    };
  }
};
