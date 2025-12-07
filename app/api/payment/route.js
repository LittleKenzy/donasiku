// app/api/payment/route.js
import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';
import { sendTransactionNotification } from '@/lib/email';

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

// POST: Proses pembayaran/donasi
export async function POST(request) {
  try {
    // Verifikasi user
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { recipientId, amount, paymentMethod } = await request.json();

    // Validasi input
    if (!recipientId || !amount || !paymentMethod) {
      return NextResponse.json(
        { success: false, message: 'Data tidak lengkap' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Jumlah harus lebih dari 0' },
        { status: 400 }
      );
    }

    // Mulai transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Cek recipient exists
      const [recipients] = await connection.query(
        'SELECT id, email FROM users WHERE id = ?',
        [recipientId]
      );

      if (recipients.length === 0) {
        throw new Error('Penerima tidak ditemukan');
      }

      // Update saldo penerima
      await connection.query(
        'UPDATE users SET balance = balance + ? WHERE id = ?',
        [amount, recipientId]
      );

      // Catat transaksi untuk penerima
      await connection.query(
        'INSERT INTO transactions (user_id, type, amount, payment_method, status, description) VALUES (?, ?, ?, ?, ?, ?)',
        [recipientId, 'donation_in', amount, paymentMethod, 'completed', `Donasi dari user ${decoded.userId}`]
      );

      // Catat transaksi untuk pengirim
      await connection.query(
        'INSERT INTO transactions (user_id, type, amount, payment_method, status, description) VALUES (?, ?, ?, ?, ?, ?)',
        [decoded.userId, 'donation_out', amount, paymentMethod, 'completed', `Donasi ke user ${recipientId}`]
      );

      // Commit transaction
      await connection.commit();
      connection.release();

      // Kirim notifikasi email (async, tidak blocking)
      sendTransactionNotification(recipients[0].email, {
        type: 'donation_in',
        amount,
        method: paymentMethod
      }).catch(err => console.error('Email notification error:', err));

      return NextResponse.json(
        {
          success: true,
          message: 'Pembayaran berhasil',
          transactionId: recipientId
        },
        { status: 200 }
      );

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// GET: Dapatkan riwayat transaksi
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

    // Ambil riwayat transaksi
    const [transactions] = await pool.query(
      'SELECT id, type, amount, payment_method, status, description, created_at FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [decoded.userId]
    );

    return NextResponse.json(
      {
        success: true,
        transactions
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}