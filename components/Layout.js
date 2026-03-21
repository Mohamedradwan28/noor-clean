import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Layout({ children, title = 'نور كلين', description = 'خدمات تنظيف ومكافحة حشرات بالرياض' }) {
  const router = useRouter();
  const [settings, setSettings] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(setSettings);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [mobileMenuOpen]);

  // WhatsApp SVG Icon
  const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
    </svg>
  );

  // Phone SVG Icon
  const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
    </svg>
  );

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={settings.seo?.canonical || 'https://noorclean.com'} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ar_SA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>

      <header>
        <div className="container">
          <Link href="/" className="logo">
            <span className="logo-icon">✨</span>
            <span>نور كلين</span>
          </Link>
          
          <nav>
            <Link href="/" className={router.pathname === '/' ? 'active' : ''}>الرئيسية</Link>
            <Link href="/#services" className={router.pathname.includes('services') ? 'active' : ''}>الخدمات</Link>
            <Link href="/articles" className={router.pathname.includes('articles') ? 'active' : ''}>المقالات</Link>
            <Link href="/contact" className={router.pathname === '/contact' ? 'active' : ''}>اتصل بنا</Link>
          </nav>
          
          <div className="header-buttons">
            <a href={`tel:${settings.phone || '0500000000'}`} className="btn btn-primary btn-sm">
              <PhoneIcon />
              اتصل
            </a>
          </div>

          <button 
            className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="القائمة"
            type="button"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <Link href="/" className={router.pathname === '/' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>🏠 الرئيسية</Link>
        <Link href="/#services" className={router.pathname.includes('services') ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>🧹 الخدمات</Link>
        <Link href="/articles" className={router.pathname.includes('articles') ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>📰 المقالات</Link>
        <Link href="/contact" className={router.pathname === '/contact' ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>📞 اتصل بنا</Link>
        <a href={`tel:${settings.phone || '0500000000'}`} className="btn btn-primary btn-block" style={{marginTop: '15px', minHeight: '50px'}}>📞 اتصل الآن</a>
        <a href={`https://wa.me/${settings.whatsapp || '966500000000'}`} className="btn btn-block" style={{marginTop: '10px', background: '#25d366', color: 'white', minHeight: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
          <span style={{width: '20px', height: '20px'}}><WhatsAppIcon /></span>
          واتساب
        </a>
      </div>

      <main>{children}</main>

      {/* Floating Buttons - WhatsApp Logo SVG */}
      <div className="floating-buttons">
        {/* Call Button - LEFT */}
        <a href={`tel:${settings.phone || '0500000000'}`} className="floating-btn floating-btn-call" title="اتصل الآن" aria-label="اتصل الآن">
          <PhoneIcon />
          <span className="floating-btn-label">اتصل</span>
        </a>
        
        {/* WhatsApp Button - RIGHT with Official Logo */}
        <a href={`https://wa.me/${settings.whatsapp || '966500000000'}`} className="floating-btn floating-btn-whatsapp" target="_blank" rel="noopener noreferrer" title="واتساب" aria-label="واتساب">
          <WhatsAppIcon />
          <span className="floating-btn-label">واتساب</span>
        </a>
      </div>

      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3>✨ عن نور كلين</h3>
              <p>{settings.tagline || 'شريكك للنظافة في الرياض'}. نقدم خدمات متكاملة بأعلى معايير الجودة.</p>
            </div>
            <div className="footer-col">
              <h3>📞 تواصل معنا</h3>
              <ul>
                <li><a href={`tel:${settings.phone || '0500000000'}`}>📱 {settings.phone || '0500000000'}</a></li>
                <li><a href={`https://wa.me/${settings.whatsapp || '966500000000'}`}>💬 واتساب</a></li>
                <li><a href={`mailto:${settings.email || 'info@noorclean.com'}`}>📧 {settings.email || 'info@noorclean.com'}</a></li>
                <li>📍 {settings.address || 'الرياض، السعودية'}</li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>🔗 روابط سريعة</h3>
              <ul>
                <li><Link href="/">الرئيسية</Link></li>
                <li><Link href="/#services">الخدمات</Link></li>
                <li><Link href="/articles">المقالات</Link></li>
                <li><Link href="/contact">اتصل بنا</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>⏰ ساعات العمل</h3>
              <p>{settings.workingHours || 'يومياً من 8 صباحاً حتى 10 مساءً'}</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} {settings.siteName || 'نور كلين'} - جميع الحقوق محفوظة</p>



    <div className="footer-bottom">
      {/* Credit with WhatsApp Link */}
      <p>
        تم التصميم بواسطة{' '}
        <a 
          href="https://wa.me/201148875706" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            color: 'var(--primary)',
            fontWeight: '700',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          💬 Mohamed Radwan
        </a>
        {' '}
        <a 
          href="tel:+201148875706"
          style={{
            color: 'var(--gray-400)',
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}
        >
          | 01148875706
        </a>
      </p>
    </div>          </div>
        </div>
      </footer>
    </>
  );
}
