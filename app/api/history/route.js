// app/api/history/route.js
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

// GET: Dapatkan riwayat transaksi lengkap
export async function GET(request) {
  try {
    const decoded = verifyToken(request);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'all', 'donation_in', 'donation_out', 'withdrawal'
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Build query dinamis
    let query = `
      SELECT 
        id, 
        type, 
        amount, 
        payment_method, 
        status, 
        description, 
        created_at 
      FROM transactions 
      WHERE user_id = ?
    `;
    
    const params = [decoded.userId];

    // Filter berdasarkan type
    if (type && type !== 'all') {
      query += ' AND type = ?';
      params.push(type);
    }

    // Filter berdasarkan tanggal
    if (startDate) {
      query += ' AND DATE(created_at) >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND DATE(created_at) <= ?';
      params.push(endDate);
    }

    // Order dan limit
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [transactions] = await pool.query(query, params);

    // Hitung total transaksi (untuk pagination)
    let countQuery = 'SELECT COUNT(*) as total FROM transactions WHERE user_id = ?';
    const countParams = [decoded.userId];

    if (type && type !== 'all') {
      countQuery += ' AND type = ?';
      countParams.push(type);
    }

    if (startDate) {
      countQuery += ' AND DATE(created_at) >= ?';
      countParams.push(startDate);
    }

    if (endDate) {
      countQuery += ' AND DATE(created_at) <= ?';
      countParams.push(endDate);
    }

    const [countResult] = await pool.query(countQuery, countParams);

    // Format transaksi
    const formattedTransactions = transactions.map(tx => ({
      id: tx.id,
      type: tx.type,
      amount: parseFloat(tx.amount),
      payment_method: tx.payment_method,
      status: tx.status,
      description: tx.description,
      created_at: tx.created_at,
      type_label: getTypeLabel(tx.type),
      icon: getTypeIcon(tx.type)
    }));

    return NextResponse.json({
      success: true,
      transactions: formattedTransactions,
      pagination: {
        total: countResult[0].total,
        limit,
        offset,
        hasMore: (offset + limit) < countResult[0].total
      }
    });

  } catch (error) {
    console.error('History error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// Helper functions
function getTypeLabel(type) {
  const labels = {
    'donation_in': 'Donasi Masuk',
    'donation_out': 'Donasi Keluar',
    'withdrawal': 'Penarikan Dana'
  };
  return labels[type] || type;
}

function getTypeIcon(type) {
  const icons = {
    'donation_in': '📥',
    'donation_out': '📤',
    'withdrawal': '💰'
  };
  return icons[type] || '💳';
}