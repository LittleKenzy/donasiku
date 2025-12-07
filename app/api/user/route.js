// app/api/user/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

// Middleware untuk verifikasi token
function verifyToken(request) {
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    return null;
  }
}

// GET: Dapatkan data user yang sedang login
export async function GET(request) {
  try {
    // Verifikasi user
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Ambil data user
    const [users] = await pool.query(
      'SELECT id, name, email, balance, created_at FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { success: false, message: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: users[0]
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// PUT: Update profil user
export async function PUT(request) {
  try {
    // Verifikasi user
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, email } = await request.json();

    // Validasi input
    if (!name && !email) {
      return NextResponse.json(
        { success: false, message: 'Tidak ada data yang diupdate' },
        { status: 400 }
      );
    }

    // Build query dinamis
    let query = 'UPDATE users SET ';
    const params = [];
    
    if (name) {
      query += 'name = ?, ';
      params.push(name);
    }
    
    if (email) {
      // Validasi format email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, message: 'Format email tidak valid' },
          { status: 400 }
        );
      }

      // Cek apakah email sudah digunakan user lain
      const [existingUsers] = await pool.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, decoded.userId]
      );

      if (existingUsers.length > 0) {
        return NextResponse.json(
          { success: false, message: 'Email sudah digunakan' },
          { status: 409 }
        );
      }

      query += 'email = ?, ';
      params.push(email);
    }

    // Hapus koma terakhir dan tambahkan WHERE clause
    query = query.slice(0, -2) + ' WHERE id = ?';
    params.push(decoded.userId);

    // Update user
    await pool.query(query, params);

    // Ambil data user yang sudah diupdate
    const [users] = await pool.query(
      'SELECT id, name, email, balance FROM users WHERE id = ?',
      [decoded.userId]
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Profil berhasil diupdate',
        user: users[0]
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}