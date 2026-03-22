// components/Layout.js
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

// ✅ دالة تنظيف الروابط - إزالة أي مسافات زائدة
const cleanUrl = (url) => {
  if (!url) return '';
  return url.toString().trim().replace(/\s+/g, '');
};

export default function Layout({ children, title = 'نور كلين', description = 'خدمات تنظيف ومكافحة حشرات بالرياض' }) {
  const router = useRouter();
  const [settings, setSettings] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // جلب الإعدادات من API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/settings?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  // إغلاق القائمة عند تغيير الصفحة
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.pathname]);

  // منع التمرير عند فتح القائمة المحمولة
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  // ✅ دوال الروابط - تم إصلاح المسافات
  const getWhatsAppLink = () => {
    const phone = cleanUrl(settings.whatsapp || settings.phone || '966500000000');
    return `https://wa.me/${phone.replace(/\D/g, '')}`;
  };

  const getPhoneLink = () => {
    const phone = cleanUrl(settings.phone || '0500000000');
    return `tel:${phone.replace(/\D/g, '')}`;
  };

  const getCanonicalUrl = () => {
    return cleanUrl(settings.seo_canonical || settings.canonical || 'https://noorclean.com');
  };

  // ✅ أيقونات SVG - مكونات قابلة لإعادة الاستخدام
  const WhatsAppIcon = ({ className = '' }) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
    </svg>
  );

  const PhoneIcon = ({ className = '' }) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  );

  // ✅ أيقونة الهامبرجر المتحركة
  const HamburgerIcon = ({ open }) => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line 
        x1="3" y1="6" x2="21" y2="6" 
        style={{ 
          transform: open ? 'rotate(45deg) translate(6px, 6px)' : 'none',
          transformOrigin: 'center',
          transition: 'all 0.3s ease'
        }} 
      />
      <line 
        x1="3" y1="12" x2="21" y2="12" 
        style={{ 
          opacity: open ? 0 : 1,
          transition: 'opacity 0.2s ease'
        }} 
      />
      <line 
        x1="3" y1="18" x2="21" y2="18" 
        style={{ 
          transform: open ? 'rotate(-45deg) translate(6px, -6px)' : 'none',
          transformOrigin: 'center',
          transition: 'all 0.3s ease'
        }} 
      />
    </svg>
  );

  const CloseIcon = () => (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );

  // ✅ بيانات التنقل
  const navLinks = [
    { href: '/', label: 'الرئيسية', icon: '🏠' },
    { href: '/#services', label: 'الخدمات', icon: '🧹' },
    { href: '/articles', label: 'المقالات', icon: '📰' },
    { href: '/contact', label: 'اتصل بنا', icon: '📞' },
  ];

  const isActive = (path) => {
    if (path === '/') return router.pathname === '/';
    return router.pathname.includes(path.replace('/#', ''));
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={getCanonicalUrl()} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ar_SA" />
        <meta property="og:url" content={getCanonicalUrl()} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>

      {/* ✅ الهيدر */}
      <header className="header">
        <div className="container header-container">
          {/* الشعار */}
          <Link href="/" className="logo">
            <span className="logo-icon">✨</span>
            <span className="logo-text">{settings.siteName || 'نور كلين'}</span>
          </Link>
          
          {/* القائمة الرئيسية - سطح المكتب فقط */}
          <nav className="nav-desktop">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`nav-link ${isActive(link.href) ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* زر الاتصال - سطح المكتب فقط */}
          <div className="header-actions desktop-only">
            <a href={getPhoneLink()} className="btn btn-primary btn-call">
              <PhoneIcon className="icon" />
              <span>اتصل</span>
            </a>
          </div>

          {/* زر الهامبرجر - موبايل فقط */}
          <button 
            className="mobile-menu-btn mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={mobileMenuOpen}
          >
            <HamburgerIcon open={mobileMenuOpen} />
          </button>
        </div>
      </header>

      {/* ✅ القائمة المحمولة مع خلفية معتمة */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />
        <div className="mobile-menu-content">
          {/* رأس القائمة */}
          <div className="mobile-menu-header">
            <span className="mobile-menu-logo">✨ {settings.siteName || 'نور كلين'}</span>
            <button 
              className="mobile-menu-close"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="إغلاق القائمة"
            >
              <CloseIcon />
            </button>
          </div>
          
          {/* روابط التنقل */}
          <nav className="mobile-nav">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`mobile-nav-link ${isActive(link.href) ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="mobile-nav-icon">{link.icon}</span>
                {link.label}
                {isActive(link.href) && <span className="mobile-nav-indicator" />}
              </Link>
            ))}
          </nav>
          
          {/* أزرار التواصل - جنب بعض */}
          <div className="mobile-contacts">
            <div className="contacts-row">
              <a href={getPhoneLink()} className="btn btn-primary btn-contact">
                <PhoneIcon className="icon" />
                <span>اتصل</span>
              </a>
              <a 
                href={getWhatsAppLink()} 
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-contact"
              >
                <WhatsAppIcon className="icon" />
                <span>واتساب</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ المحتوى الرئيسي */}
      <main className="main-content">{children}</main>

      {/* ✅ الأزرار العائمة - موبايل فقط - جنب بعض في المنتصف */}
      <div className="floating-buttons mobile-only">
        <a 
          href={getWhatsAppLink()} 
          className="floating-btn floating-btn-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="مراسلتنا على واتساب"
        >
          <WhatsAppIcon className="icon" />
        </a>
        <a 
          href={getPhoneLink()} 
          className="floating-btn floating-btn-call"
          aria-label="الاتصال بنا"
        >
          <PhoneIcon className="icon" />
        </a>
      </div>

      {/* ✅ الفوتر */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            {/* عن الشركة */}
            <div className="footer-section">
              <h3 className="footer-title">✨ عن نور كلين</h3>
              <p className="footer-text">
                {settings.tagline || 'شريكك للنظافة في الرياض'}. نقدم خدمات متكاملة بأعلى معايير الجودة.
              </p>
            </div>
            
            {/* التواصل */}
            <div className="footer-section">
              <h3 className="footer-title">📞 تواصل معنا</h3>
              <div className="footer-contacts-row">
                <a href={getPhoneLink()} className="footer-contact-btn">
                  <PhoneIcon className="icon-sm" />
                  <span>{settings.phone || '0500000000'}</span>
                </a>
                <a 
                  href={getWhatsAppLink()} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-contact-btn whatsapp"
                >
                  <WhatsAppIcon className="icon-sm" />
                  <span>واتساب</span>
                </a>
              </div>
              <ul className="footer-list">
                <li>
                  <a href={`mailto:${cleanUrl(settings.email || 'info@noorclean.com')}`} className="footer-link">
                    📧 {settings.email || 'info@noorclean.com'}
                  </a>
                </li>
                <li className="footer-link">
                  📍 {settings.address || 'الرياض، السعودية'}
                </li>
              </ul>
            </div>
            
            {/* روابط سريعة */}
            <div className="footer-section">
              <h3 className="footer-title">🔗 روابط سريعة</h3>
              <ul className="footer-list">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="footer-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* ساعات العمل */}
            <div className="footer-section">
              <h3 className="footer-title">⏰ ساعات العمل</h3>
              <p className="footer-text">
                {settings.workingHours || 'يومياً من 8 صباحاً حتى 10 مساءً'}
              </p>
            </div>
          </div>
          
          {/* الحقوق */}
          <div className="footer-bottom">
            <p>
              © {new Date().getFullYear()} {settings.siteName || 'نور كلين'} - جميع الحقوق محفوظة
            </p>
            <p className="footer-credit">
              تم التصميم بواسطة{' '}
              <a 
                href="https://wa.me/201148875106" 
                target="_blank" 
                rel="noopener noreferrer"
                className="credit-link"
              >
                💬 Mohamed Radwan
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* ✅ CSS Styles - Styled JSX */}
      <style jsx>{`
        /* ========== المتغيرات العامة ========== */
        :global(:root) {
          --color-primary: #10b981;
          --color-primary-dark: #059669;
          --color-primary-light: #34d399;
          --color-whatsapp: #25D366;
          --color-whatsapp-dark: #128C7E;
          --color-text: #111827;
          --color-text-light: #6b7280;
          --color-text-muted: #9ca3af;
          --color-bg: #ffffff;
          --color-bg-alt: #f9fafb;
          --color-footer: #111827;
          --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
          --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
          --shadow-lg: 0 10px 25px -5px rgba(0,0,0,0.15);
          --shadow-primary: 0 4px 14px rgba(16, 185, 129, 0.4);
          --shadow-whatsapp: 0 4px 14px rgba(37, 211, 102, 0.4);
          --radius: 12px;
          --radius-lg: 16px;
          --radius-full: 9999px;
          --transition: all 0.25s ease;
          --transition-slow: all 0.4s ease;
        }

        /* ========== إعادة تعيين أساسية ========== */
        :global(*) {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :global(html) {
          scroll-behavior: smooth;
        }

        :global(body) {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans Arabic', 'Tajawal', Arial, sans-serif;
          direction: rtl;
          background: var(--color-bg);
          color: var(--color-text);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* ========== الحاوية ========== */
        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* ========== الهيدر ========== */
        .header {
          background: var(--color-bg);
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 12px 0;
          transition: var(--transition);
        }

        .header.scrolled {
          padding: 8px 0;
          box-shadow: var(--shadow-md);
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        /* الشعار */
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: var(--color-text);
          font-weight: 700;
          font-size: 1.25rem;
          transition: var(--transition);
        }

        .logo:hover {
          color: var(--color-primary);
        }

        .logo-icon {
          font-size: 1.5rem;
          display: inline-block;
          animation: sparkle 2s ease-in-out infinite;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }

        .logo-text {
          white-space: nowrap;
        }

        /* القائمة - سطح المكتب */
        .nav-desktop {
          display: flex;
          gap: 28px;
          align-items: center;
        }

        .nav-link {
          color: var(--color-text-light);
          text-decoration: none;
          font-weight: 500;
          padding: 8px 4px;
          transition: var(--transition);
          position: relative;
          font-size: 1rem;
        }

        .nav-link:hover {
          color: var(--color-primary);
        }

        .nav-link.active {
          color: var(--color-primary);
          font-weight: 600;
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          right: 0;
          left: 0;
          height: 2px;
          background: var(--color-primary);
          border-radius: 2px;
        }

        /* الأزرار العامة */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: var(--radius);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: var(--transition);
          cursor: pointer;
          border: none;
          white-space: nowrap;
        }

        .btn:active {
          transform: translateY(1px);
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
          color: white;
          box-shadow: var(--shadow-primary);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.5);
        }

        .btn-whatsapp {
          background: linear-gradient(135deg, var(--color-whatsapp), var(--color-whatsapp-dark));
          color: white;
          box-shadow: var(--shadow-whatsapp);
        }

        .btn-whatsapp:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(37, 211, 102, 0.5);
        }

        .btn-full {
          width: 100%;
        }

        .icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        /* زر الهامبرجر - تصميم محسّن */
        .mobile-menu-btn {
          background: var(--color-bg-alt);
          border: none;
          padding: 10px;
          cursor: pointer;
          color: var(--color-text);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius);
          transition: var(--transition);
          width: 44px;
          height: 44px;
        }

        .mobile-menu-btn:hover {
          background: #e5e7eb;
          transform: scale(1.05);
        }

        .mobile-menu-btn:active {
          transform: scale(0.95);
        }

        /* ========== القائمة المحمولة ========== */
        .mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          max-width: 340px;
          height: 100vh;
          background: var(--color-bg);
          box-shadow: var(--shadow-lg);
          z-index: 200;
          transform: translateX(100%);
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
        }

        .mobile-menu.active {
          transform: translateX(0);
        }

        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          z-index: -1;
          opacity: 0;
          visibility: hidden;
          transition: var(--transition-slow);
        }

        .mobile-menu.active .mobile-menu-overlay {
          opacity: 1;
          visibility: visible;
        }

        .mobile-menu-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow-y: auto;
          position: relative;
        }

        /* رأس القائمة المحمولة */
        .mobile-menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0 20px;
          border-bottom: 1px solid #f3f4f6;
          margin-bottom: 16px;
        }

        .mobile-menu-logo {
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--color-text);
        }

        .mobile-menu-close {
          background: var(--color-bg-alt);
          border: none;
          padding: 8px;
          cursor: pointer;
          color: var(--color-text-light);
          border-radius: var(--radius);
          transition: var(--transition);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-menu-close:hover {
          background: #e5e7eb;
          color: var(--color-text);
        }

        /* روابط التنقل المحمولة */
        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin: 8px 0;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          color: var(--color-text);
          text-decoration: none;
          font-weight: 500;
          font-size: 1.05rem;
          border-radius: var(--radius);
          transition: var(--transition);
          position: relative;
        }

        .mobile-nav-link:hover {
          background: var(--color-bg-alt);
          color: var(--color-primary);
        }

        .mobile-nav-link.active {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
          color: var(--color-primary);
          font-weight: 600;
        }

        .mobile-nav-link.active .mobile-nav-indicator {
          position: absolute;
          right: 16px;
          width: 6px;
          height: 6px;
          background: var(--color-primary);
          border-radius: 50%;
        }

        .mobile-nav-icon {
          font-size: 1.3rem;
          flex-shrink: 0;
        }

        /* أزرار التواصل في الموبايل */
        .mobile-contacts {
          margin-top: auto;
          padding-top: 24px;
          border-top: 1px solid #f3f4f6;
        }

        .contacts-row {
          display: flex;
          gap: 12px;
          width: 100%;
        }

        .btn-contact {
          flex: 1;
          padding: 12px 16px;
          font-size: 0.95rem;
          justify-content: center;
          border-radius: var(--radius-lg);
        }

        .btn-contact .icon {
          width: 18px;
          height: 18px;
        }

        /* ========== المحتوى الرئيسي ========== */
        .main-content {
          min-height: calc(100vh - 280px);
        }

        /* ========== الأزرار العائمة ========== */
        .floating-buttons {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 14px;
          z-index: 150;
          pointer-events: none;
          padding: 0 16px;
        }

        .floating-btn {
          pointer-events: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          text-decoration: none;
          color: white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
          transition: var(--transition);
          position: relative;
          overflow: hidden;
        }

        /* تأثير اللمعة */
        .floating-btn::after {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(255, 255, 255, 0.35) 50%,
            transparent 70%
          );
          transform: rotate(45deg) translateX(-150%);
          transition: transform 0.7s ease;
          pointer-events: none;
        }

        .floating-btn:hover::after {
          transform: rotate(45deg) translateX(150%);
        }

        .floating-btn:hover {
          transform: translateY(-4px) scale(1.08);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);
        }

        .floating-btn:active {
          transform: translateY(-1px) scale(1.02);
        }

        .floating-btn-call {
          background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
        }

        .floating-btn-whatsapp {
          background: linear-gradient(135deg, var(--color-whatsapp), var(--color-whatsapp-dark));
        }

        .floating-btn .icon {
          width: 26px;
          height: 26px;
          flex-shrink: 0;
        }

        /* ========== الفوتر ========== */
        .footer {
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          color: white;
          padding: 60px 0 30px;
          margin-top: 80px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 32px;
          margin-bottom: 40px;
        }

        .footer-title {
          font-size: 1.15rem;
          font-weight: 700;
          margin-bottom: 18px;
          color: white;
          position: relative;
          padding-bottom: 10px;
        }

        .footer-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: 0;
          width: 40px;
          height: 2px;
          background: var(--color-primary);
          border-radius: 2px;
        }

        .footer-text {
          color: var(--color-text-muted);
          line-height: 1.8;
          font-size: 0.95rem;
        }

        .footer-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .footer-link {
          color: var(--color-text-muted);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: var(--transition);
          font-size: 0.95rem;
        }

        .footer-link:hover {
          color: var(--color-primary-light);
          transform: translateX(-4px);
        }

        .footer-link.whatsapp:hover {
          color: var(--color-whatsapp);
        }

        /* أزرار التواصل في الفوتر */
        .footer-contacts-row {
          display: flex;
          gap: 10px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .footer-contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: var(--radius);
          color: var(--color-text-muted);
          text-decoration: none;
          font-size: 0.9rem;
          transition: var(--transition);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-contact-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .footer-contact-btn.whatsapp:hover {
          color: var(--color-whatsapp);
        }

        .icon-sm {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        .footer-bottom {
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }

        .footer-bottom p {
          margin: 8px 0;
        }

        .credit-link {
          color: var(--color-primary-light);
          font-weight: 600;
          text-decoration: none;
          transition: var(--transition);
        }

        .credit-link:hover {
          color: var(--color-primary);
        }

        /* ========== Media Queries - التجاوب ========== */
        
        /* إخفاء العناصر حسب حجم الشاشة */
        @media (min-width: 992px) {
          .mobile-only {
            display: none !important;
          }
        }

        @media (max-width: 991px) {
          .desktop-only {
            display: none !important;
          }
          
          .nav-desktop {
            display: none;
          }
        }

        /* شاشات التابلت والموبايل */
        @media (max-width: 768px) {
          .container {
            padding: 0 16px;
          }

          .header {
            padding: 10px 0;
          }

          .logo-text {
            font-size: 1.15rem;
          }

          .logo-icon {
            font-size: 1.4rem;
          }

          /* الأزرار العائمة */
          .floating-buttons {
            gap: 12px;
            bottom: 20px;
          }

          .floating-btn {
            width: 50px;
            height: 50px;
          }

          .floating-btn .icon {
            width: 24px;
            height: 24px;
          }

          /* الفوتر */
          .footer-grid {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .footer-title::after {
            right: 50%;
            transform: translateX(50%);
          }

          .footer-list {
            align-items: center;
          }

          .footer-link {
            justify-content: center;
          }

          .footer-contacts-row {
            justify-content: center;
          }
        }

        /* شاشات الموبايل الصغيرة */
        @media (max-width: 480px) {
          .header-container {
            padding: 0 12px;
          }

          .logo-text {
            font-size: 1.1rem;
          }

          /* الأزرار العائمة */
          .floating-buttons {
            gap: 10px;
            bottom: 16px;
          }

          .floating-btn {
            width: 48px;
            height: 48px;
          }

          .floating-btn .icon {
            width: 22px;
            height: 22px;
          }

          /* القائمة المحمولة */
          .mobile-menu {
            max-width: 100%;
          }

          .contacts-row {
            flex-direction: column;
          }

          .btn-contact {
            width: 100%;
          }

          /* الفوتر */
          .footer {
            padding: 45px 0 25px;
          }

          .footer-contacts-row {
            flex-direction: column;
            align-items: center;
          }

          .footer-contact-btn {
            width: 100%;
            max-width: 280px;
            justify-content: center;
          }
        }

        /* شاشات صغيرة جدًا */
        @media (max-width: 360px) {
          .floating-buttons {
            gap: 8px;
          }

          .floating-btn {
            width: 44px;
            height: 44px;
          }

          .floating-btn .icon {
            width: 20px;
            height: 20px;
          }

          .btn-contact {
            padding: 10px 12px;
            font-size: 0.9rem;
          }
        }

        /* وضع الأفقي للموبايل */
        @media (orientation: landscape) and (max-height: 500px) {
          .floating-buttons {
            bottom: 12px;
          }

          .header {
            padding: 6px 0;
          }

          .mobile-menu-content {
            padding: 12px;
          }

          .mobile-nav {
            gap: 4px;
          }

          .mobile-nav-link {
            padding: 10px 14px;
            font-size: 1rem;
          }
        }

        /* تحسينات إمكانية الوصول */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        @media (prefers-contrast: high) {
          .nav-link.active::after {
            height: 3px;
          }

          .btn {
            border: 2px solid currentColor;
          }
        }

        /* تحسين التمرير */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: var(--color-bg-alt);
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .mobile-menu-content::-webkit-scrollbar {
          width: 4px;
        }
      `}</style>
    </>
  );
}