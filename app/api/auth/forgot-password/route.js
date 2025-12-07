// app/api/auth/forgot-password/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { sendVerificationCode } from '@/lib/email';

// Generate random 6-digit code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST: Kirim kode verifikasi
export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email harus diisi' },
        { status: 400 }
      );
    }

    // Cek apakah email terdaftar
    const [users] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Email tidak terdaftar' },
        { status: 404 }
      );
    }

    // Generate kode verifikasi
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 menit

    // Hapus kode lama untuk email ini
    await pool.query(
      'DELETE FROM password_resets WHERE email = ?',
      [email]
    );

    // Simpan kode baru
    await pool.query(
      'INSERT INTO password_resets (email, code, expires_at) VALUES (?, ?, ?)',
      [email, code, expiresAt]
    );

    // Kirim email
    const emailResult = await sendVerificationCode(email, code);

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, message: 'Gagal mengirim email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Kode verifikasi telah dikirim ke email Anda'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// PUT: Verifikasi kode dan reset password
export async function PUT(request) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Validasi panjang password
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    // Cek kode verifikasi
    const [resets] = await pool.query(
      'SELECT * FROM password_resets WHERE email = ? AND code = ? AND expires_at > NOW()',
      [email, code]
    );

    if (resets.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Kode verifikasi salah atau sudah kadaluarsa' },
        { status: 400 }
      );
    }

    // Hash password baru
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password user
    await pool.query(
      'UPDATE users SET password = ? WHERE email = ?',
      [hashedPassword, email]
    );

    // Hapus kode verifikasi
    await pool.query(
      'DELETE FROM password_resets WHERE email = ?',
      [email]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Password berhasil direset'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}