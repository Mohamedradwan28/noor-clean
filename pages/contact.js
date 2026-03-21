import { useState } from 'react';
import Layout from '../components/Layout';
import Head from 'next/head';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', service: '', message: '', location: '' });
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', phone: '', email: '', service: '', message: '', location: '' });
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
      <Layout title="اتصل بنا | نور كلين">
        <div className="container">
          <div className="section-title">
            <h2>📞 تواصل معنا</h2>
            <div className="line"></div>
            <p>نحن هنا لخدمتك، تواصل معنا في أي وقت</p>
          </div>

          <div className="contact-grid">
            <div className="contact-cell">
              <h3>📍 معلومات الاتصال</h3>
              <div className="contact-info-item">
                <span className="icon">📱</span>
                <div className="text"><strong>رقم الهاتف</strong><span>{settings.phone || '0500000000'}</span></div>
              </div>
              <div className="contact-info-item">
                <span className="icon">💬</span>
                <div className="text"><strong>واتساب</strong><span>{settings.whatsapp || '966500000000'}</span></div>
              </div>
              <div className="contact-info-item">
                <span className="icon">📧</span>
                <div className="text"><strong>البريد الإلكتروني</strong><span>{settings.email || 'info@noorclean.com'}</span></div>
              </div>
              <div className="contact-info-item">
                <span className="icon">📍</span>
                <div className="text"><strong>العنوان</strong><span>{settings.address || 'الرياض، المملكة العربية السعودية'}</span></div>
              </div>
              <div className="contact-info-item">
                <span className="icon">⏰</span>
                <div className="text"><strong>ساعات العمل</strong><span>{settings.workingHours || 'يومياً من 8 صباحاً حتى 10 مساءً'}</span></div>
              </div>
            </div>

            <div className="contact-cell">
              <h3>✉️ أرسل لنا رسالة</h3>
              {submitted && <div className="success-message">✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>الاسم الكامل *</label>
                    <input type="text" name="name" className="form-input" value={formData.name} onChange={handleChange} required placeholder="محمد أحمد" />
                  </div>
                  <div className="form-group">
                    <label>رقم الهاتف *</label>
                    <input type="tel" name="phone" className="form-input" value={formData.phone} onChange={handleChange} required placeholder="0500000000" dir="ltr" />
                  </div>
                </div>
                <div className="form-group">
                  <label>البريد الإلكتروني</label>
                  <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} placeholder="example@email.com" dir="ltr" />
                </div>
                <div className="form-group">
                  <label>نوع الخدمة</label>
                  <select name="service" className="form-select" value={formData.service} onChange={handleChange}>
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
                <div className="form-group">
                  <label>الموقع</label>
                  <input type="text" name="location" className="form-input" value={formData.location} onChange={handleChange} placeholder="الحي - المدينة" />
                </div>
                <div className="form-group">
                  <label>الرسالة *</label>
                  <textarea name="message" className="form-textarea" value={formData.message} onChange={handleChange} required placeholder="اكتب تفاصيل طلبك هنا..."></textarea>
                </div>
                <button type="submit" className="btn btn-primary btn-lg btn-block">📤 إرسال الرسالة</button>
              </form>
            </div>
          </div>

          <div className="contact-cell" style={{ marginTop: '40px' }}>
            <h3>🗺️ موقعنا على الخريطة</h3>

            {/* خريطة جوجل - رابط يعمل 100% */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.6!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ5LjAiTiA0NsKwNDAnMzEuMCJF!5e0!3m2!1sen!2ssa!4v1234567890"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: 'var(--radius-lg)', width: '100%', minHeight: '300px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقع نور كلين - الرياض"
            ></iframe>

            {/* رابط بديل في حال فشل التحميل */}
            <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address || 'الرياض، المملكة العربية السعودية')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}
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