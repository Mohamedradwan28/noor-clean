// pages/contact.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

export default function Contact() {
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    email: '', 
    service: '', 
    message: '', 
    location: '' 
  });
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  // جلب الإعدادات عند تحميل الصفحة
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // ✅ إضافة timestamp لمنع الكاش
        const res = await fetch(`/api/settings?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', phone: '', email: '', service: '', message: '', location: '' });
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Head>
        <title>اتصل بنا | نور كلين</title>
        <meta name="description" content="تواصل مع نور كلين لخدمات التنظيف ومكافحة الحشرات في الرياض" />
      </Head>
      
      <Layout>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#111827', marginBottom: '15px' }}>
              📞 تواصل معنا
            </h2>
            <div style={{ width: '60px', height: '4px', background: '#10b981', margin: '0 auto 15px', borderRadius: '2px' }}></div>
            <p style={{ color: '#6b7280', maxWidth: '500px', margin: '0 auto' }}>
              نحن هنا لخدمتك، تواصل معنا في أي وقت
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '40px',
            marginBottom: '50px'
          }}>
            {/* معلومات الاتصال */}
            <div style={{ 
              background: 'white', 
              padding: '30px', 
              borderRadius: '20px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)' 
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#111827', marginBottom: '25px' }}>
                📍 معلومات الاتصال
              </h3>
              
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <span style={{ fontSize: '1.5rem' }}>📱</span>
                <div>
                  <strong style={{ display: 'block', color: '#374151', marginBottom: '4px' }}>رقم الهاتف</strong>
                  <span style={{ color: '#6b7280', direction: 'ltr', display: 'inline-block' }}>
                    {settings.phone || '0500000000'}
                  </span>
                </div>
              </div>
              
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <span style={{ fontSize: '1.5rem' }}>💬</span>
                <div>
                  <strong style={{ display: 'block', color: '#374151', marginBottom: '4px' }}>واتساب</strong>
                  <a 
                    href={`https://wa.me/${(settings.whatsapp || '966500000000').replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#10b981', textDecoration: 'none', direction: 'ltr', display: 'inline-block' }}
                  >
                    {settings.whatsapp || '966500000000'}
                  </a>
                </div>
              </div>
              
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <span style={{ fontSize: '1.5rem' }}>📧</span>
                <div>
                  <strong style={{ display: 'block', color: '#374151', marginBottom: '4px' }}>البريد الإلكتروني</strong>
                  <span style={{ color: '#6b7280' }}>{settings.email || 'info@noorclean.com'}</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <span style={{ fontSize: '1.5rem' }}>📍</span>
                <div>
                  <strong style={{ display: 'block', color: '#374151', marginBottom: '4px' }}>العنوان</strong>
                  <span style={{ color: '#6b7280' }}>{settings.address || 'الرياض، المملكة العربية السعودية'}</span>
                </div>
              </div>
              
              <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                <span style={{ fontSize: '1.5rem' }}>⏰</span>
                <div>
                  <strong style={{ display: 'block', color: '#374151', marginBottom: '4px' }}>ساعات العمل</strong>
                  <span style={{ color: '#6b7280' }}>{settings.workingHours || 'يومياً من 8 صباحاً حتى 10 مساءً'}</span>
                </div>
              </div>
            </div>

            {/* نموذج الاتصال */}
            <div style={{ 
              background: 'white', 
              padding: '30px', 
              borderRadius: '20px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)' 
            }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#111827', marginBottom: '25px' }}>
                ✉️ أرسل لنا رسالة
              </h3>
              
              {submitted && (
                <div style={{ 
                  background: '#ecfdf5', 
                  color: '#059669', 
                  padding: '15px', 
                  borderRadius: '12px', 
                  marginBottom: '20px',
                  textAlign: 'center',
                  fontWeight: '500'
                }}>
                  ✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500' }}>الاسم الكامل *</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                      placeholder="محمد أحمد"
                      style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '1rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500' }}>رقم الهاتف *</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      required 
                      placeholder="0500000000" 
                      dir="ltr"
                      style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '1rem' }}
                    />
                  </div>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500' }}>البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="example@email.com" 
                    dir="ltr"
                    style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '1rem' }}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500' }}>نوع الخدمة</label>
                  <select 
                    name="service" 
                    value={formData.service} 
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '1rem', background: 'white' }}
                  >
                    <option value="">اختر الخدمة</option>
                    <option value="مكافحة حشرات">مكافحة حشرات</option>
                    <option value="تنظيف فلل">تنظيف فلل</option>
                    <option value="تنظيف شقق">تنظيف شقق</option>
                    <option value="تنظيف سجاد">تنظيف سجاد</option>
                    <option value="تنظيف كنب">تنظيف كنب</option>
                    <option value="تنظيف مكيفات">تنظيف مكيفات</option>
                    <option value="تسليك مجاري">تسليك مجاري</option>
                    <option value="تنظيف خزانات">تنظيف خزانات</option>
                    <option value="عزل أسطح">عزل أسطح</option>
                    <option value="طرد حمام">طرد حمام</option>
                  </select>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500' }}>الموقع</label>
                  <input 
                    type="text" 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    placeholder="الحي - المدينة"
                    style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '1rem' }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500' }}>الرسالة *</label>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    required 
                    placeholder="اكتب تفاصيل طلبك هنا..."
                    rows="4"
                    style={{ width: '100%', padding: '12px 15px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '1rem', resize: 'vertical' }}
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1.05rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.4)';
                  }}
                >
                  📤 إرسال الرسالة
                </button>
              </form>
            </div>
          </div>

          {/* الخريطة */}
          <div style={{ 
            background: 'white', 
            padding: '30px', 
            borderRadius: '20px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            marginBottom: '40px'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>
              🗺️ موقعنا على الخريطة
            </h3>
            
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.6!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ5LjAiTiA0NsKwNDAnMzEuMCJF!5e0!3m2!1sen!2ssa!4v1234567890`}
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '16px', width: '100%' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقع نور كلين - الرياض"
            ></iframe>
            
            <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem', color: '#6b7280' }}>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address || 'الرياض، المملكة العربية السعودية')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#10b981', fontWeight: '600', textDecoration: 'none' }}
              >
                📍 افتح الخريطة في تطبيق جديد ←
              </a>
            </p>
          </div>
        </div>
      </Layout>
    </>
  );
}