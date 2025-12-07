// lib/email.js
import nodemailer from 'nodemailer';

// Konfigurasi transporter email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true untuk port 465, false untuk port lainnya
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Gunakan App Password untuk Gmail
  }
});

// Fungsi untuk mengirim kode verifikasi
export async function sendVerificationCode(email, code) {
  try {
    const mailOptions = {
      from: `"DonasiKu" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Kode Verifikasi Reset Password - DonasiKu',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .code-box { background: white; border: 3px solid #a855f7; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
            .code { font-size: 36px; font-weight: bold; color: #a855f7; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎁 DonasiKu</h1>
            </div>
            <div class="content">
              <h2>Kode Verifikasi Reset Password</h2>
              <p>Halo,</p>
              <p>Kami menerima permintaan untuk reset password akun Anda. Gunakan kode verifikasi berikut:</p>
              
              <div class="code-box">
                <div class="code">${code}</div>
              </div>
              
              <p>Kode ini akan kadaluarsa dalam <strong>15 menit</strong>.</p>
              <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
              
              <div class="footer">
                <p>© 2024 DonasiKu. Platform Donasi Terpercaya.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error);
    return { success: false, error: error.message };
  }
}

// Fungsi untuk mengirim notifikasi transaksi
export async function sendTransactionNotification(email, transactionData) {
  try {
    const { type, amount, method } = transactionData;
    const mailOptions = {
      from: `"DonasiKu" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${type === 'donation_in' ? 'Donasi Diterima' : 'Penarikan Dana'} - DonasiKu`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .amount { font-size: 32px; font-weight: bold; color: #a855f7; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💰 ${type === 'donation_in' ? 'Donasi Diterima' : 'Penarikan Dana'}</h1>
            </div>
            <div class="content">
              <p>Transaksi Anda telah berhasil diproses:</p>
              <div class="amount">Rp ${parseInt(amount).toLocaleString('id-ID')}</div>
              <p><strong>Metode:</strong> ${method}</p>
              <p><strong>Tanggal:</strong> ${new Date().toLocaleString('id-ID')}</p>
              <p>Terima kasih telah menggunakan DonasiKu!</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('❌ Transaction notification error:', error);
    return { success: false, error: error.message };
  }
}