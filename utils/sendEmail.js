// utils/sendEmail.js
const nodemailer = require('nodemailer');

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // ตรวจสอบค่าคอนฟิก
  if (!host || !user || !pass) {
    throw new Error('SMTP configuration missing. Please check your .env file.');
  }

  return nodemailer.createTransport({
    host,
    port,
    // สำหรับ Gmail Port 465 ต้องใช้ secure: true
    // สำหรับ Port 587 ต้องใช้ secure: false
    secure: port === 465, 
    auth: {
      user,
      pass
    },
    // ป้องกันปัญหาเรื่อง Certificate ในบางสภาพแวดล้อม (เช่น เน็ตมหาลัย)
    tls: {
      rejectUnauthorized: false
    }
  });
};

/**
 * sendEmail({ email, subject, message, html })
 */
module.exports = async function sendEmail({ email, subject, message, html }) {
  if (!email) throw new Error('sendEmail: "email" is required');

  const transporter = createTransporter();

  const mailOptions = {
    // ใช้ FROM_EMAIL จาก env ถ้าไม่มีให้ใช้ SMTP_USER
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: email,
    subject: subject || '(no subject)',
    text: message || '',
    // ปรับปรุงการแปลง newline เป็น <br/> ให้ปลอดภัยขึ้น
    html: html || (message ? message.toString().replace(/\n/g, '<br/>') : '')
  };

  try {
    // ตรวจสอบการเชื่อมต่อก่อนส่ง
    await transporter.verify();
    
    // ส่งเมล
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully: %s", info.messageId);
    return info;
  } catch (error) {
    // ส่ง Error กลับไปให้ Controller จัดการ (เช่น log ลง console)
    console.error("❌ Email Error:", error.message);
    throw error; 
  }
};