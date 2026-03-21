// components/Layout.js
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

// دالة تنظيف الروابط من مسافات
const cleanUrl = (url) => {
  if (!url) return '';
  return url.toString().trim().replace(/\s+/g, '');
};

export default function Layout({ children, title = 'نور كلين', description = 'خدمات تنظيف ومكافحة حشرات بالرياض' }) {
  const router = useRouter();
  const [settings, setSettings] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // دوال مساعدة للروابط
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

  // أيقونات SVG
  const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{width: '20px', height: '20px', fill: 'currentColor'}}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
    </svg>
  );

  const PhoneIcon = () => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{width: '20px', height: '20px', fill: 'currentColor'}}>
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

      {/* Header */}
      <header style={{
        background: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '12px 0'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <Link href="/" className="logo" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: '#111827',
            fontWeight: '700',
            fontSize: '1.2rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>✨</span>
            <span>{settings.siteName || 'نور كلين'}</span>
          </Link>
          
          <nav style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
            <Link href="/" style={{
              color: router.pathname === '/' ? '#10b981' : '#6b7280',
              textDecoration: 'none',
              fontWeight: router.pathname === '/' ? '600' : '500',
              transition: 'color 0.2s'
            }}>الرئيسية</Link>
            <Link href="/#services" style={{
              color: router.pathname.includes('services') ? '#10b981' : '#6b7280',
              textDecoration: 'none',
              fontWeight: router.pathname.includes('services') ? '600' : '500',
              transition: 'color 0.2s'
            }}>الخدمات</Link>
            <Link href="/articles" style={{
              color: router.pathname.includes('articles') ? '#10b981' : '#6b7280',
              textDecoration: 'none',
              fontWeight: router.pathname.includes('articles') ? '600' : '500',
              transition: 'color 0.2s'
            }}>المقالات</Link>
            <Link href="/contact" style={{
              color: router.pathname === '/contact' ? '#10b981' : '#6b7280',
              textDecoration: 'none',
              fontWeight: router.pathname === '/contact' ? '600' : '500',
              transition: 'color 0.2s'
            }}>اتصل بنا</Link>
          </nav>
          
          <div>
            <a 
              href={getPhoneLink()} 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '0.95rem',
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
              <PhoneIcon />
              اتصل
            </a>
          </div>

          <button 
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '10px',
              flexDirection: 'column',
              gap: '5px'
            }}
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="القائمة"
          >
            <span style={{ display: 'block', width: '25px', height: '3px', background: '#374151', borderRadius: '2px' }}></span>
            <span style={{ display: 'block', width: '25px', height: '3px', background: '#374151', borderRadius: '2px' }}></span>
            <span style={{ display: 'block', width: '25px', height: '3px', background: '#374151', borderRadius: '2px' }}></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`} style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '280px',
        height: '100vh',
        background: 'white',
        boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
        padding: '20px',
        zIndex: 200,
        transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <button 
          onClick={() => setMobileMenuOpen(false)}
          style={{
            alignSelf: 'flex-end',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#6b7280',
            marginBottom: '20px'
          }}
        >
          ✕
        </button>
        
        <Link href="/" style={{
          padding: '15px 0',
          borderBottom: '1px solid #f3f4f6',
          color: router.pathname === '/' ? '#10b981' : '#374151',
          textDecoration: 'none',
          fontWeight: router.pathname === '/' ? '600' : '500',
          fontSize: '1.1rem'
        }} onClick={() => setMobileMenuOpen(false)}>🏠 الرئيسية</Link>
        
        <Link href="/#services" style={{
          padding: '15px 0',
          borderBottom: '1px solid #f3f4f6',
          color: router.pathname.includes('services') ? '#10b981' : '#374151',
          textDecoration: 'none',
          fontWeight: router.pathname.includes('services') ? '600' : '500',
          fontSize: '1.1rem'
        }} onClick={() => setMobileMenuOpen(false)}>🧹 الخدمات</Link>
        
        <Link href="/articles" style={{
          padding: '15px 0',
          borderBottom: '1px solid #f3f4f6',
          color: router.pathname.includes('articles') ? '#10b981' : '#374151',
          textDecoration: 'none',
          fontWeight: router.pathname.includes('articles') ? '600' : '500',
          fontSize: '1.1rem'
        }} onClick={() => setMobileMenuOpen(false)}>📰 المقالات</Link>
        
        <Link href="/contact" style={{
          padding: '15px 0',
          borderBottom: '1px solid #f3f4f6',
          color: router.pathname === '/contact' ? '#10b981' : '#374151',
          textDecoration: 'none',
          fontWeight: router.pathname === '/contact' ? '600' : '500',
          fontSize: '1.1rem'
        }} onClick={() => setMobileMenuOpen(false)}>📞 اتصل بنا</Link>
        
        <a 
          href={getPhoneLink()} 
          style={{
            marginTop: '20px',
            padding: '14px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '600',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <PhoneIcon /> اتصل الآن
        </a>
        
        <a 
          href={getWhatsAppLink()} 
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: '12px',
            padding: '14px',
            background: '#25D366',
            color: 'white',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '600',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <WhatsAppIcon /> واتساب
        </a>
      </div>

      {/* Main Content */}
      <main>{children}</main>

      {/* Floating Buttons */}
      <div className="floating-buttons" style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        right: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 150,
        pointerEvents: 'none'
      }}>
        <a 
          href={getPhoneLink()} 
          className="floating-btn-call"
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 20px',
            background: 'white',
            color: '#10b981',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.95rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
          }}
        >
          <PhoneIcon />
          <span>اتصل</span>
        </a>
        
        <a 
          href={getWhatsAppLink()} 
          className="floating-btn-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 20px',
            background: '#25D366',
            color: 'white',
            borderRadius: '50px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '0.95rem',
            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-3px)';
            e.target.style.boxShadow = '0 8px 30px rgba(37, 211, 102, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.4)';
          }}
        >
          <WhatsAppIcon />
          <span>واتساب</span>
        </a>
      </div>

      {/* Footer */}
      <footer style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        color: 'white',
        padding: '60px 20px 30px',
        marginTop: '80px'
      }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '30px',
            marginBottom: '40px'
          }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', color: 'white' }}>✨ عن نور كلين</h3>
              <p style={{ color: '#9ca3af', lineHeight: 1.7 }}>
                {settings.tagline || 'شريكك للنظافة في الرياض'}. نقدم خدمات متكاملة بأعلى معايير الجودة.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', color: 'white' }}>📞 تواصل معنا</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li>
                  <a href={getPhoneLink()} style={{ color: '#9ca3af', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#10b981'} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                    📱 {settings.phone || '0500000000'}
                  </a>
                </li>
                <li>
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" style={{ color: '#9ca3af', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#25D366'} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                    💬 واتساب
                  </a>
                </li>
                <li>
                  <a href={`mailto:${cleanUrl(settings.email || 'info@noorclean.com')}`} style={{ color: '#9ca3af', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#10b981'} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>
                    📧 {settings.email || 'info@noorclean.com'}
                  </a>
                </li>
                <li style={{ color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  📍 {settings.address || 'الرياض، السعودية'}
                </li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', color: 'white' }}>🔗 روابط سريعة</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><Link href="/" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#10b981'} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>الرئيسية</Link></li>
                <li><Link href="/#services" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#10b981'} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>الخدمات</Link></li>
                <li><Link href="/articles" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#10b981'} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>المقالات</Link></li>
                <li><Link href="/contact" style={{ color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#10b981'} onMouseLeave={(e) => e.target.style.color = '#9ca3af'}>اتصل بنا</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '20px', color: 'white' }}>⏰ ساعات العمل</h3>
              <p style={{ color: '#9ca3af', lineHeight: 1.7 }}>
                {settings.workingHours || 'يومياً من 8 صباحاً حتى 10 مساءً'}
              </p>
            </div>
          </div>
          
          <div style={{
            paddingTop: '25px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '0.9rem'
          }}>
            <p style={{ marginBottom: '10px' }}>
              © {new Date().getFullYear()} {settings.siteName || 'نور كلين'} - جميع الحقوق محفوظة
            </p>
            <p>
              تم التصميم بواسطة{' '}
              <a 
                href="https://wa.me/201148875106" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  color: '#10b981',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#34d399'}
                onMouseLeave={(e) => e.target.style.color = '#10b981'}
              >
                💬 Mohamed Radwan
              </a>
              {' '}|{' '}
              <a 
                href="tel:+201148875706"
                style={{
                  color: '#6b7280',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = '#10b981'}
                onMouseLeave={(e) => e.target.style.color = '#6b7280'}
              >
                01148875706
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* CSS Styles */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .mobile-menu.active ~ main,
        .mobile-menu.active ~ footer {
          filter: blur(4px);
          pointer-events: none;
        }
        @media (max-width: 768px) {
          header .container nav,
          header .container > div:last-child {
            display: none;
          }
          header .container .mobile-menu-btn {
            display: flex !important;
          }
          .floating-buttons {
            flex-direction: column;
            align-items: center;
            gap: 12px;
          }
          .floating-buttons .floating-btn {
            width: 100%;
            max-width: 200px;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}