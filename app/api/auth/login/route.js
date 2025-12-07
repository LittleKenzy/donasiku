// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email dan password harus diisi' },
        { status: 400 }
      );
    }

    // Cari user berdasarkan email
    const [users] = await pool.query(
      'SELECT id, name, email, password, balance FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Email atau password salah' },
        { status: 401 }
      );
    }

    const user = users[0];

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Email atau password salah' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Hapus password dari response
    const { password: _, ...userWithoutPassword } = user;

    // Set cookie dengan token
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login berhasil',
        user: userWithoutPassword,
        token
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 hari
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}