'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Heart, Send, Wallet, CheckCircle, X, Loader2 } from 'lucide-react';

// Component Login
const LoginForm = ({ onSwitch, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        onLogin(data.user, data.token);
      } else {
        setError(data.message || 'Login gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Heart className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">DonasiKu</h1>
          <p className="text-gray-500 mt-2">Platform donasi terpercaya</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                placeholder="email@example.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSwitch('forgot')}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium text-gray-900"
            disabled={loading}
          >
            Lupa password?
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Loading...
              </>
            ) : (
              'Masuk'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Belum punya akun?{' '}
            <button
              onClick={() => onSwitch('register')}
              className="text-purple-600 hover:text-purple-700 font-semibold"
              disabled={loading}
            >
              Daftar sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Component Register
const RegisterForm = ({ onSwitch }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => onSwitch('login'), 2000);
      } else {
        setError(data.message || 'Registrasi gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Registrasi Berhasil!</h2>
          <p className="text-gray-600">Mengalihkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Heart className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Daftar Akun</h1>
          <p className="text-gray-500 mt-2">Mulai berbagi kebaikan</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                placeholder="Nama Anda"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                placeholder="email@example.com"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 text-gray-900 "
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Loading...
              </>
            ) : (
              'Daftar'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Sudah punya akun?{' '}
            <button
              onClick={() => onSwitch('login')}
              className="text-purple-600 hover:text-purple-700 font-semibold"
              disabled={loading}
            >
              Masuk
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Component Forgot Password
const ForgotPasswordForm = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setStep('verify');
      } else {
        setError(data.message || 'Gagal mengirim kode');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword })
      });

      const data = await response.json();

      if (data.success) {
        alert('Password berhasil direset!');
        onSwitch('login');
      } else {
        setError(data.message || 'Verifikasi gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-4">
            <Mail className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Lupa Password</h1>
          <p className="text-gray-500 mt-2">
            {step === 'email' ? 'Masukkan email Anda' : 'Masukkan kode verifikasi'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                  placeholder="email@example.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Mengirim...
                </>
              ) : (
                'Kirim Kode Verifikasi'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kode Verifikasi</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                placeholder="000000"
                maxLength="6"
                required
                disabled={loading}
              />
              <p className="text-sm text-gray-500 mt-2">
                Kode telah dikirim ke {email}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                placeholder="••••••••"
                minLength="6"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Memverifikasi...
                </>
              ) : (
                'Verifikasi & Reset Password'
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => onSwitch('login')}
            className="text-purple-600 hover:text-purple-700 font-semibold"
            disabled={loading}
          >
            Kembali ke login
          </button>
        </div>
      </div>
    </div>
  );
};

// Component Dashboard
const Dashboard = ({ user, token, onLogout }) => {
  const [view, setView] = useState('home');
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [showQRIS, setShowQRIS] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(user);
  const [transactions, setTransactions] = useState([]);

  const paymentMethods = [
    { id: 'qris', name: 'QRIS', icon: '📱', color: 'from-blue-500 to-blue-600' },
    { id: 'dana', name: 'DANA', icon: '💙', color: 'from-sky-500 to-sky-600' },
    { id: 'ovo', name: 'OVO', icon: '💜', color: 'from-purple-500 to-purple-600' },
    { id: 'gopay', name: 'GoPay', icon: '💚', color: 'from-green-500 to-green-600' },
    { id: 'shopee', name: 'ShopeePay', icon: '🧡', color: 'from-orange-500 to-orange-600' },
  ];

  // Fetch user data dan transactions saat mount
  useEffect(() => {
    fetchUserData();
    fetchTransactions();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUserData(data.user);
      }
    } catch (err) {
      console.error('Failed to fetch user data:', err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/payment', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };

  const handlePayment = async () => {
    if (!amount || !selectedMethod) {
      alert('Pilih jumlah dan metode pembayaran!');
      return;
    }

    if (selectedMethod === 'qris') {
      setShowQRIS(true);
    } else {
      setLoading(true);
      try {
        const response = await fetch('/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            recipientId: userData.id,
            amount: parseFloat(amount),
            paymentMethod: selectedMethod
          })
        });

        const data = await response.json();

        if (data.success) {
          setPaymentSuccess(true);
          await fetchUserData();
          await fetchTransactions();
          setTimeout(() => {
            setPaymentSuccess(false);
            setView('home');
            setAmount('');
            setSelectedMethod('');
          }, 2000);
        } else {
          alert(data.message || 'Pembayaran gagal');
        }
      } catch (err) {
        alert('Terjadi kesalahan. Coba lagi.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleQRISPayment = async () => {
    setShowQRIS(false);
    setLoading(true);

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientId: userData.id,
          amount: parseFloat(amount),
          paymentMethod: 'qris'
        })
      });

      const data = await response.json();

      if (data.success) {
        setPaymentSuccess(true);
        await fetchUserData();
        await fetchTransactions();
        setTimeout(() => {
          setPaymentSuccess(false);
          setView('home');
          setAmount('');
          setSelectedMethod('');
        }, 2000);
      } else {
        alert(data.message || 'Pembayaran gagal');
      }
    } catch (err) {
      alert('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
          <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pembayaran Berhasil!</h2>
          <p className="text-gray-600">Donasi Anda telah diterima</p>
          <p className="text-3xl font-bold text-purple-600 mt-4">
            Rp {parseInt(amount).toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    );
  }

  if (showQRIS) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Scan QRIS</h2>
            <button onClick={() => setShowQRIS(false)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border-4 border-purple-500 mb-6">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 aspect-square rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-sm text-gray-600">QR Code QRIS</p>
                <p className="text-xs text-gray-500 mt-2">Scan dengan aplikasi e-wallet</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <p className="text-gray-600">Total Pembayaran</p>
            <p className="text-3xl font-bold text-purple-600">
              Rp {parseInt(amount).toLocaleString('id-ID')}
            </p>
          </div>

          <button
            onClick={handleQRISPayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              'Simulasi Pembayaran Berhasil'
            )}
          </button>
        </div>
      </div>
    );
  }

  if (view === 'send') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setView('home')}
                className="text-gray-600 hover:text-gray-800 font-semibold"
              >
                ← Kembali
              </button>
              <h2 className="text-2xl font-bold text-gray-800">Kirim Donasi</h2>
              <div className="w-20"></div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Donasi</label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-gray-600 font-semibold">Rp</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl text-2xl font-bold focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
              <div className="flex gap-2 mt-3">
                {[10000, 25000, 50000, 100000].map(val => (
                  <button
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className="flex-1 py-2 px-3 bg-purple-50 text-purple-600 rounded-lg text-sm font-semibold hover:bg-purple-100 transition-colors"
                  >
                    {val / 1000}k
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">Metode Pembayaran</label>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${selectedMethod === method.id
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                      }`}
                  >
                    <div className="text-4xl mb-2">{method.icon}</div>
                    <p className="font-semibold text-gray-800">{method.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={!amount || !selectedMethod || loading}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${amount && selectedMethod
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing...
                </>
              ) : (
                'Lanjutkan Pembayaran'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'withdraw') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setView('home')}
                className="text-gray-600 hover:text-gray-800 font-semibold"
              >
                ← Kembali
              </button>
              <h2 className="text-2xl font-bold text-gray-800">Tarik Dana</h2>
              <div className="w-20"></div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-6">
              <p className="text-sm opacity-90 mb-1">Saldo Tersedia</p>
              <p className="text-3xl font-bold">
                Rp {parseFloat(userData.balance).toLocaleString('id-ID')}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Penarikan</label>
              <div className="relative">
                <span className="absolute left-4 top-4 text-gray-600 font-semibold">Rp</span>
                <input
                  type="number"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-xl text-2xl font-bold focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="0"
                  max={userData.balance}
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">Tujuan Penarikan</label>
              <div className="space-y-3">
                {['DANA', 'OVO', 'GoPay', 'Bank BCA', 'Bank Mandiri'].map(method => (
                  <button
                    key={method}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 text-left font-semibold text-gray-800"
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl">
              Tarik Dana
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Heart className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-gray-800">DonasiKu</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Selamat datang,</p>
              <p className="font-semibold text-gray-800">{userData.name}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 text-white mb-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-2">Total Saldo</p>
              <p className="text-4xl font-bold mb-6">
                Rp {parseFloat(userData.balance).toLocaleString('id-ID')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setView('send')}
                  className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <Send size={20} />
                  Kirim Donasi
                </button>
                <button
                  onClick={() => setView('withdraw')}
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center gap-2"
                >
                  <Wallet size={20} />
                  Tarik Dana
                </button>
              </div>
            </div>
            <Wallet size={80} className="opacity-20" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Transaksi Terakhir</h3>
            <div className="space-y-3">
              {transactions.length > 0 ? (
                transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-800">{tx.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                    <p className={`font-bold ${tx.type === 'donation_in' ? 'text-green-600' : 'text-red-600'}`}>
                      {tx.type === 'donation_in' ? '+' : '-'}Rp {parseFloat(tx.amount).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Belum ada transaksi</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Fitur Cepat</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '📊', label: 'Statistik', color: 'from-blue-500 to-blue-600' },
                { icon: '⚙️', label: 'Pengaturan', color: 'from-gray-500 to-gray-600' },
                { icon: '📜', label: 'Riwayat', color: 'from-green-500 to-green-600' },
                { icon: '❓', label: 'Bantuan', color: 'from-orange-500 to-orange-600' },
              ].map((feature, i) => (
                <button
                  key={i}
                  className={`p-4 bg-gradient-to-r ${feature.color} rounded-xl text-white hover:scale-105 transition-transform duration-300 shadow-lg`}
                >
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <p className="font-semibold text-sm">{feature.label}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Link Donasi Anda</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={`https://donasiku.app/${userData.name.toLowerCase().replace(' ', '')}`}
              readOnly
              className="flex-1 px-4 py-3 bg-gray-50 border text-gray-900 border-gray-300 rounded-xl font-mono text-sm"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(`https://donasiku.app/${userData.name.toLowerCase().replace(' ', '')}`);
                alert('Link berhasil disalin!');
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg"
            >
              Salin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function Home() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    setPage('dashboard');
    
    // Simpan token ke localStorage (optional)
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', authToken);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setPage('login');
    
    // Hapus token dari localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }

    // Logout dari server (hapus cookie)
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  };

  const handleSwitch = (target) => {
    setPage(target);
  };

  // Check existing session saat mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('authToken');
      if (savedToken) {
        // Verify token dengan server
        fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${savedToken}`
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setUser(data.user);
              setToken(savedToken);
              setPage('dashboard');
            } else {
              localStorage.removeItem('authToken');
            }
          })
          .catch(() => {
            localStorage.removeItem('authToken');
          });
      }
    }
  }, []);

  if (page === 'login') return <LoginForm onSwitch={handleSwitch} onLogin={handleLogin} />;
  if (page === 'register') return <RegisterForm onSwitch={handleSwitch} />;
  if (page === 'forgot') return <ForgotPasswordForm onSwitch={handleSwitch} />;
  if (page === 'dashboard' && user && token) return <Dashboard user={user} token={token} onLogout={handleLogout} />;

  return <LoginForm onSwitch={handleSwitch} onLogin={handleLogin} />;
}