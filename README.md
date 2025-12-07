# 📚 Dokumentasi Fitur DonasiKu

## 🎯 Fitur Utama

### 1. 📊 **Statistik**

Menampilkan analisis lengkap aktivitas donasi pengguna.

**Endpoint:** `GET /api/statistics`

**Fitur:**
- Total donasi masuk (jumlah & nominal)
- Total donasi keluar (jumlah & nominal)
- Total penarikan dana
- Rata-rata donasi masuk
- Metode pembayaran favorit
- Statistik per bulan (6 bulan terakhir)

**Cara Menggunakan:**
1. Klik tombol "📊 Statistik" di dashboard
2. Lihat ringkasan lengkap aktivitas Anda
3. Analisis tren donasi bulanan
4. Identifikasi metode pembayaran paling sering digunakan

**Response Example:**
```json
{
  "success": true,
  "statistics": {
    "balance": 50000,
    "donations_in": {
      "total": 10,
      "amount": 500000,
      "average": 50000
    },
    "donations_out": {
      "total": 5,
      "amount": 250000
    },
    "withdrawals": {
      "total": 2,
      "amount": 100000
    },
    "top_methods": [
      {
        "method": "QRIS",
        "count": 5,
        "total_amount": 250000
      }
    ]
  }
}
```

---

### 2. 📜 **Riwayat Transaksi**

Melihat semua riwayat transaksi dengan filter dan pagination.

**Endpoint:** `GET /api/history`

**Query Parameters:**
- `type` - Filter jenis transaksi (all, donation_in, donation_out, withdrawal)
- `limit` - Jumlah data per halaman (default: 50)
- `offset` - Offset untuk pagination (default: 0)
- `start_date` - Filter tanggal mulai (format: YYYY-MM-DD)
- `end_date` - Filter tanggal akhir (format: YYYY-MM-DD)

**Fitur:**
- Filter berdasarkan tipe transaksi
- Pagination untuk performa optimal
- Filter berdasarkan tanggal
- Detail lengkap setiap transaksi
- Status transaksi (pending/completed/failed)

**Cara Menggunakan:**
1. Klik tombol "📜 Riwayat" di dashboard
2. Pilih filter transaksi (Semua/Donasi Masuk/Donasi Keluar/Penarikan)
3. Scroll untuk melihat lebih banyak transaksi
4. Lihat detail: tanggal, waktu, metode, dan status

**Response Example:**
```json
{
  "success": true,
  "transactions": [
    {
      "id": 1,
      "type": "donation_in",
      "amount": 50000,
      "payment_method": "QRIS",
      "status": "completed",
      "description": "Donasi dari user 5",
      "created_at": "2024-12-07T10:30:00",
      "type_label": "Donasi Masuk",
      "icon": "📥"
    }
  ],
  "pagination": {
    "total": 25,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

---

### 3. ⚙️ **Pengaturan**

Kelola profil dan keamanan akun.

**Endpoints:**
- `GET /api/settings` - Ambil data pengaturan
- `PUT /api/settings` - Update profil
- `POST /api/settings` - Ganti password

**Fitur:**
- Update nama
- Update email
- Ganti password dengan verifikasi password lama
- Notifikasi pengaturan (coming soon)
- Two-factor authentication (coming soon)

**Cara Menggunakan:**

**Update Profil:**
1. Klik tombol "⚙️ Pengaturan"
2. Edit nama atau email
3. Klik "Simpan Perubahan"

**Ganti Password:**
1. Masukkan password lama
2. Masukkan password baru (minimal 6 karakter)
3. Konfirmasi password baru
4. Klik "Ubah Password"

**Request Example (Update Profil):**
```json
{
  "name": "John Doe Updated",
  "email": "newemail@example.com"
}
```

**Request Example (Ganti Password):**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

---

### 4. ❓ **Bantuan (Help Center)**

Pusat bantuan dengan FAQ dan kontak support.

**Fitur:**
- FAQ lengkap
- Panduan penggunaan
- Kontak email support
- Live chat support (UI ready)

**Topik Bantuan:**
- Cara menerima donasi
- Metode pembayaran
- Cara tarik dana
- Minimal penarikan
- Biaya layanan
- Keamanan transaksi
- Reset password

**Cara Menggunakan:**
1. Klik tombol "❓ Bantuan"
2. Baca FAQ yang tersedia
3. Klik pertanyaan untuk melihat jawaban
4. Hubungi support jika butuh bantuan lebih

---

## 🔐 Security Features

### Authentication & Authorization
- ✅ JWT Token dengan expiry 7 hari
- ✅ HTTP-only cookies untuk keamanan
- ✅ Bearer token di Authorization header
- ✅ Password hashing dengan bcrypt (10 rounds)
- ✅ Token validation di setiap request

### Data Protection
- ✅ SQL injection prevention (prepared statements)
- ✅ Input validation & sanitization
- ✅ Email verification untuk reset password
- ✅ Rate limiting (recommended untuk production)
- ✅ HTTPS enforcement (production)

---

## 📱 User Experience Features

### Loading States
- Semua API call menampilkan loading indicator
- Disable button saat processing
- Skeleton loading untuk data fetch

### Error Handling
- User-friendly error messages
- Validation errors ditampilkan jelas
- Network error handling
- Auto-logout untuk expired token

### Responsive Design
- Mobile-first approach
- Optimized untuk tablet & desktop
- Touch-friendly buttons
- Adaptive grid layout

---

## 🚀 API Performance

### Optimizations
- Database indexing untuk query cepat
- Connection pooling untuk MySQL
- Efficient SQL queries dengan JOIN
- Pagination untuk large datasets
- Caching strategy (recommended)

### Database Indexes
```sql
-- Recommended indexes untuk performa
CREATE INDEX idx_user_transactions ON transactions(user_id, created_at);
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_email_code ON password_resets(email, code);
CREATE INDEX idx_transaction_type ON transactions(type, status);
```

---

## 📊 Data Analytics

### Statistik yang Tersedia
1. **Total Metrics**: Donasi masuk, keluar, penarikan
2. **Average Metrics**: Rata-rata donasi per transaksi
3. **Time Series**: Trend bulanan (6 bulan)
4. **Top Lists**: Metode pembayaran favorit
5. **Balance Tracking**: Real-time balance updates

### Export Data (Future Feature)
- Export riwayat ke CSV
- Export statistik ke PDF
- Monthly report via email

---

## 🔄 Transaction Flow

### Donation Flow
```
User → Select Amount → Choose Method → Payment Gateway → 
Success → Update Balance → Send Email → Show Receipt
```

### Withdrawal Flow
```
User → Request Withdrawal → Validate Balance → 
Process Request → Pending Status → 
Admin Approval (optional) → Transfer → Completed
```

---

## 💡 Best Practices

### Untuk Pengguna
1. Gunakan password kuat (minimal 8 karakter, kombinasi huruf & angka)
2. Aktifkan notifikasi email untuk transaksi penting
3. Periksa riwayat transaksi secara berkala
4. Tarik dana secara teratur untuk keamanan
5. Jangan share link donasi di platform mencurigakan

### Untuk Developer
1. Selalu validate input di backend
2. Log semua transaksi untuk audit trail
3. Monitor error logs untuk debugging
4. Backup database secara berkala
5. Test payment integration di sandbox dulu
6. Implement rate limiting untuk prevent abuse
7. Use environment variables untuk sensitive data

---

## 🐛 Troubleshooting

### Statistik tidak muncul
- Check console untuk error
- Verify token masih valid
- Pastikan ada transaksi di database

### Riwayat kosong
- Pastikan sudah ada transaksi
- Check filter yang dipilih
- Verify user_id di token match dengan data

### Gagal update profil
- Check apakah email sudah digunakan user lain
- Verify format email valid
- Check network connection

### Password tidak bisa diganti
- Pastikan password lama benar
- Password baru minimal 6 karakter
- Password baru dan konfirmasi harus sama

---

## 📞 Support

**Email:** support@donasiku.app  
**Live Chat:** Available 24/7 in app  
**Documentation:** https://docs.donasiku.app  
**GitHub:** https://github.com/donasiku/app

---

## 🎉 Coming Soon

- [ ] Export transaksi ke Excel/PDF
- [ ] Notifikasi push
- [ ] Two-factor authentication
- [ ] Multi-currency support
- [ ] Recurring donations
- [ ] QR code generator untuk donation link
- [ ] Advanced analytics dashboard
- [ ] Mobile app (iOS & Android)