// app/api/statistics/route.js
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

// GET: Dapatkan statistik user
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

    // Ambil total donasi masuk
    const [donationsIn] = await pool.query(
      `SELECT 
        COUNT(*) as total_donations,
        COALESCE(SUM(amount), 0) as total_amount
       FROM transactions 
       WHERE user_id = ? AND type = 'donation_in' AND status = 'completed'`,
      [decoded.userId]
    );

    // Ambil total donasi keluar
    const [donationsOut] = await pool.query(
      `SELECT 
        COUNT(*) as total_donations,
        COALESCE(SUM(amount), 0) as total_amount
       FROM transactions 
       WHERE user_id = ? AND type = 'donation_out' AND status = 'completed'`,
      [decoded.userId]
    );

    // Ambil total penarikan
    const [withdrawals] = await pool.query(
      `SELECT 
        COUNT(*) as total_withdrawals,
        COALESCE(SUM(amount), 0) as total_amount
       FROM transactions 
       WHERE user_id = ? AND type = 'withdrawal'`,
      [decoded.userId]
    );

    // Ambil statistik per bulan (6 bulan terakhir)
    const [monthlyStats] = await pool.query(
      `SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        type,
        COUNT(*) as count,
        SUM(amount) as total
       FROM transactions 
       WHERE user_id = ? 
         AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(created_at, '%Y-%m'), type
       ORDER BY month DESC`,
      [decoded.userId]
    );

    // Ambil metode pembayaran paling sering
    const [topMethods] = await pool.query(
      `SELECT 
        payment_method,
        COUNT(*) as count,
        SUM(amount) as total_amount
       FROM transactions 
       WHERE user_id = ? AND payment_method IS NOT NULL
       GROUP BY payment_method
       ORDER BY count DESC
       LIMIT 5`,
      [decoded.userId]
    );

    // Hitung rata-rata donasi
    const avgDonationIn = donationsIn[0].total_donations > 0 
      ? donationsIn[0].total_amount / donationsIn[0].total_donations 
      : 0;

    // Ambil saldo saat ini
    const [user] = await pool.query(
      'SELECT balance FROM users WHERE id = ?',
      [decoded.userId]
    );

    return NextResponse.json({
      success: true,
      statistics: {
        balance: parseFloat(user[0].balance),
        donations_in: {
          total: donationsIn[0].total_donations,
          amount: parseFloat(donationsIn[0].total_amount),
          average: parseFloat(avgDonationIn)
        },
        donations_out: {
          total: donationsOut[0].total_donations,
          amount: parseFloat(donationsOut[0].total_amount)
        },
        withdrawals: {
          total: withdrawals[0].total_withdrawals,
          amount: parseFloat(withdrawals[0].total_amount)
        },
        monthly_stats: monthlyStats.map(stat => ({
          month: stat.month,
          type: stat.type,
          count: stat.count,
          total: parseFloat(stat.total)
        })),
        top_methods: topMethods.map(method => ({
          method: method.payment_method,
          count: method.count,
          total_amount: parseFloat(method.total_amount)
        }))
      }
    });

  } catch (error) {
    console.error('Statistics error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}