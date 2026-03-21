import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminLoginTime', Date.now().toString());
      router.push('/admin/dashboard');
    } else {
      setError('❌ كلمة المرور غير صحيحة');
      setPassword('');
    }
  };

  return (
    <>
      <Head>
        <title>تسجيل الدخول | لوحة تحكم نور كلين</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="login-container">
        <div className="login-card">
          <span className="logo-icon">🔐</span>
          <h1>لوحة تحكم الأدمن</h1>
          <p>نور كلين - إدارة المحتوى والأرشفة</p>
          {error && <div style={{background: 'var(--danger-light)', color: 'var(--danger)', padding: '18px', borderRadius: 'var(--radius-lg)', marginBottom: '25px', fontWeight: '600'}}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>كلمة المرور</label>
              <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="أدخل كلمة المرور" required style={{textAlign: 'left', direction: 'ltr', fontSize: '1.1rem'}} disabled={loading} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>{loading ? '⏳ جاري الدخول...' : '🔓 تسجيل الدخول'}</button>
          </form>
          <p style={{marginTop: '30px', fontSize: '0.95rem', color: 'var(--gray-500)'}}><a href="/" style={{color: 'var(--primary)', fontWeight: '600'}}>← العودة للموقع الرئيسي</a></p>
          <p style={{marginTop: '20px', fontSize: '0.85rem', color: 'var(--gray-400)'}}>🔒 دخول آمن ومحمي</p>
        </div>
      </div>
    </>
  );
}