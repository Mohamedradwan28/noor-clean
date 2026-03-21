import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Link from 'next/link';

export default function AdminSetup() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSetup = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || data.message);
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container" style={{maxWidth: '800px', margin: '50px auto', padding: '40px'}}>
        <div style={{background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}>
          <h1 style={{fontSize: '2rem', marginBottom: '20px', color: '#10b981'}}>🚀 إعداد قاعدة البيانات</h1>
          <p style={{color: '#666', marginBottom: '30px', lineHeight: '1.8'}}>
            اضغط على الزر أدناه لإنشاء الجداول والبيانات الأولية في Supabase تلقائياً.
            هذه العملية ستتم <strong>مرة واحدة فقط</strong> عند تشغيل الموقع لأول مرة.
          </p>

          {error && (
            <div style={{background: '#fee', color: '#c00', padding: '20px', borderRadius: '12px', marginBottom: '20px'}}>
              ❌ {error}
            </div>
          )}

          {result && (
            <div style={{background: '#efe', color: '#060', padding: '20px', borderRadius: '12px', marginBottom: '20px'}}>
              <h3 style={{marginBottom: '15px'}}>✅ {result.message}</h3>
              <div style={{display: 'grid', gap: '10px'}}>
                <div>📊 الجداول: {result.tables.join(', ')}</div>
                <div>🧹 الخدمات: {result.servicesCount}</div>
                <div>📰 المقالات: {result.articlesCount}</div>
                <div>⚙️ الإعدادات: {result.settingsCount}</div>
              </div>
            </div>
          )}

          <button
            onClick={handleSetup}
            disabled={loading}
            style={{
              width: '100%',
              padding: '18px',
              background: loading ? '#ccc' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ جاري الإعداد...' : '🚀 إنشاء الجداول والبيانات'}
          </button>

          {result && (
            <div style={{marginTop: '30px', textAlign: 'center'}}>
              <Link href="/admin/dashboard" style={{color: '#10b981', fontWeight: 'bold', fontSize: '1.1rem'}}>
                الذهاب للوحة التحكم ←
              </Link>
            </div>
          )}

          <div style={{marginTop: '40px', padding: '20px', background: '#f5f5f5', borderRadius: '12px', fontSize: '0.9rem'}}>
            <h4 style={{marginBottom: '15px'}}>📋 ماذا سيحدث؟</h4>
            <ul style={{listStyle: 'none', padding: 0, lineHeight: '2'}}>
              <li>✅ إنشاء جدول الخدمات (services)</li>
              <li>✅ إنشاء جدول المقالات (articles)</li>
              <li>✅ إنشاء جدول الإعدادات (settings)</li>
              <li>✅ إضافة 3 خدمات افتراضية</li>
              <li>✅ إضافة مقالين افتراضيين</li>
              <li>✅ إضافة إعدادات الموقع الأساسية</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}