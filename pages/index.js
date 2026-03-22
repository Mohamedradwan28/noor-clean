import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  const [services, setServices] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, articlesRes, settingsRes] = await Promise.all([
          fetch('/api/services').then(res => res.json()),
          fetch('/api/articles').then(res => res.json()).catch(() => []),
          fetch('/api/settings').then(res => res.json())
        ]);
        setServices(servicesRes);
        setArticles(articlesRes);
        setSettings(settingsRes);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Prepare SEO data
  const baseUrl = settings.seo?.canonical || 'https://noor-clean.vercel.app/';
  const siteTitle = `${settings.siteName || 'نور كلين'} | ${settings.tagline || 'خدمات تنظيف ومكافحة حشرات بالرياض'}`;
  const siteDescription = settings.seo?.defaultDescription || 'أفضل خدمات تنظيف ومكافحة حشرات في الرياض. ضمان كامل، فريق محترف، مواد آمنة معتمدة من وزارة الصحة';
  const siteKeywords = settings.seo?.defaultKeywords || 'تنظيف، مكافحة حشرات، الرياض، نور كلين، تنظيف فلل، تنظيف شقق، تنظيف كنب، غسيل سجاد، تسليك مجاري، تنظيف خزانات، عزل أسطح';
  const siteImage = `${baseUrl}/og-image.jpg`;

  // Structured Data - LocalBusiness
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": settings.siteName || 'نور كلين',
    "image": `${baseUrl}/logo.png`,
    "@id": baseUrl,
    "url": baseUrl,
    "telephone": settings.phone || '+9660578048389',
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "",
      "addressLocality": "الرياض",
      "addressRegion": "منطقة الرياض",
      "postalCode": "",
      "addressCountry": "SA"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 24.7136,
      "longitude": 46.6753
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      "opens": "08:00",
      "closes": "22:00"
    },
    "priceRange": "$$",
    "sameAs": [
      `https://wa.me/${settings.whatsapp || '+9660578048389'}`
    ],
    "makesOffer": services.filter(s => s.active).map(service => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": service.title,
        "description": service.shortDescription
      }
    }))
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "الرئيسية",
      "item": baseUrl
    }]
  };

  // FAQ Schema (for rich snippets)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "ما هي خدمات نور كلين؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نقدم خدمات متكاملة تشمل: مكافحة الحشرات، تنظيف الفلل والشقق، غسيل السجاد والكنب، تنظيف المكيفات، تسليك المجاري، تنظيف الخزانات، وعزل الأسطح."
        }
      },
      {
        "@type": "Question",
        "name": "هل تقدمون ضمان على الخدمات؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نعم، نقدم ضمان كامل على جميع خدماتنا مع إمكانية المتابعة المجانية لضمان رضا العملاء."
        }
      },
      {
        "@type": "Question",
        "name": "ما هي مناطق الخدمة في الرياض؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نغطي جميع أحياء الرياض بما في ذلك: النرجس، الياسمين، الملقا، العليا، السويدي، والورود."
        }
      }
    ]
  };

  return (
    <>
      <Head>
        {/* ===== Basic Meta Tags ===== */}
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="keywords" content={siteKeywords} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <meta name="bingbot" content="index, follow" />
        <link rel="canonical" href={baseUrl} />
        <meta name="author" content="نور كلين" />
        <meta name="publisher" content="نور كلين" />
        
        {/* ===== Language & Region ===== */}
        <meta httpEquiv="content-language" content="ar-SA" />
        <meta name="geo.region" content="SA-01" />
        <meta name="geo.placename" content="الرياض" />
        
        {/* ===== Open Graph / Facebook ===== */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={baseUrl} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={siteImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="نور كلين - خدمات تنظيف ومكافحة حشرات" />
        <meta property="og:locale" content="ar_SA" />
        <meta property="og:site_name" content="نور كلين" />
        
        {/* ===== Twitter Card ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={baseUrl} />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={siteImage} />
        <meta name="twitter:creator" content="@noorclean" />
        
        {/* ===== Additional SEO Tags ===== */}
        <meta name="theme-color" content="#10b981" />
        <meta name="msapplication-TileColor" content="#10b981" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* ===== Preload Critical Resources ===== */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="dns-prefetch" href="https://wa.me" />
        
        {/* ===== Structured Data - JSON-LD ===== */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        
        {/* ===== Service Schema for each service (dynamic) ===== */}
        {services.filter(s => s.active).slice(0, 5).map(service => (
          <script 
            key={`service-schema-${service.id}`} 
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              "name": service.title,
              "description": service.shortDescription,
              "provider": {
                "@type": "LocalBusiness",
                "name": settings.siteName || 'نور كلين'
              },
              "areaServed": {
                "@type": "City",
                "name": "الرياض"
              },
              "offers": {
                "@type": "Offer",
                "priceCurrency": "SAR",
                "availability": "https://schema.org/InStock"
              }
            })}} 
          />
        ))}
      </Head>

      <Layout>
        {/* ===== Hero Section with SEO-friendly content ===== */}
        <section className="hero">
          <div className="hero-content">
            <h1>
              <span itemProp="name">{settings.siteName || 'نور كلين'}</span> - {settings.tagline || 'شريكك للنظافة في الرياض'}
            </h1>
            <p itemProp="description">
              نقدم أفضل خدمات تنظيف الشامل ومكافحة لحشرات بأحدث التقنيات. ضمان كامل، فريق محترف، ومواد آمنة معتمدة من وزارة الصحة السعودية.
            </p>
            <div className="hero-buttons" itemProp="action" itemScope itemType="https://schema.org/ReserveAction">
              <Link href="/contact" className="btn btn-primary btn-lg" itemProp="target">
                📞 احجز خدمتك الآن
              </Link>
              <a 
                href={`https://wa.me/${settings.whatsapp || '+9660578048389'}`} 
                className="btn btn-secondary btn-lg" 
                target="_blank" 
                rel="noopener noreferrer"
                itemProp="potentialAction"
                itemScope
                itemType="https://schema.org/CommunicateAction"
              >
                💬 تواصل واتساب
              </a>
            </div>
          </div>
          
          {/* ===== Hero Stats with Schema ===== */}
          <div className="hero-stats" itemScope itemType="https://schema.org/Organization">
            <meta itemProp="name" content={settings.siteName || 'نور كلين'} />
            <meta itemProp="telephone" content={settings.phone || '+9660578048389'} />
            <div className="hero-stat">
              <span className="hero-stat-number" itemProp="numberOfEmployees">{services.length}</span>
              <span className="hero-stat-label">خدمة متخصصة</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">+5000</span>
              <span className="hero-stat-label">عميل سعيد</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-number">+10</span>
              <span className="hero-stat-label">سنوات خبرة</span>
            </div>
          </div>
        </section>

        {/* ===== Services Section with ItemList Schema ===== */}
        <section id="services" className="container services-section" itemScope itemType="https://schema.org/ItemList">
          <div className="section-title">
            <h2>خدماتنا المتكاملة</h2>
            <div className="line"></div>
            <p>نقدم مجموعة شاملة من خدمات التنظيف والصيانة بأعلى معايير الجودة</p>
          </div>
          
          {loading ? (
            <div className="loading"><div className="loading-spinner"></div></div>
          ) : services.length > 0 ? (
            <>
              <meta itemProp="numberOfItems" content={services.filter(s => s.active).length} />
              <div className="services-grid">
                {services.filter(s => s.active).map((service, index) => (
                  <Link 
                    href={`/services/${service.slug}`} 
                    key={service.id} 
                    className="service-cell"
                    itemProp="itemListElement"
                    itemScope
                    itemType="https://schema.org/ListItem"
                  >
                    <meta itemProp="position" content={index + 1} />
                    <img 
                      src={service.image} 
                      alt={service.seo?.ogTitle || service.title} 
                      className="service-cell-image" 
                      loading="lazy"
                      width="400"
                      height="200"
                    />
                    <div className="service-cell-content">
                      <div className="service-cell-icon">{service.icon || '🧹'}</div>
                      <span className="service-cell-category" itemProp="category">{service.category || 'خدمة'}</span>
                      <h3 itemProp="name">{service.title}</h3>
                      <p itemProp="description">{service.shortDescription || service.description}</p>
                      {service.features && service.features.length > 0 && (
                        <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px'}}>
                          {service.features.slice(0, 3).map((feature, i) => (
                            <span key={i} style={{background: 'var(--gray-100)', color: 'var(--gray-700)', padding: '6px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: '600'}} itemProp="serviceType">{feature}</span>
                          ))}
                        </div>
                      )}
                      <button className="btn btn-primary" itemProp="url">اعرف المزيد ←</button>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div style={{padding: '60px', textAlign: 'center', background: 'var(--white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)'}}>
              <h3 style={{fontSize: '1.5rem', color: 'var(--gray-600)', marginBottom: '15px'}}>🎉 مرحباً بك في نور كلين!</h3>
              <p style={{color: 'var(--gray-500)', marginBottom: '30px'}}>لا توجد خدمات مضافة بعد.</p>
              <Link href="/admin/login" className="btn btn-primary btn-lg">الذهاب للوحة التحكم</Link>
            </div>
          )}
        </section>

        {/* ===== Features Section ===== */}
        <section className="container" itemScope itemType="https://schema.org/Service">
          <div className="features">
            <div className="section-title">
              <h2>لماذا تختار نور كلين؟</h2>
              <div className="line"></div>
            </div>
            <div className="features-grid">
              <div className="feature-cell">
                <span className="feature-icon">✅</span>
                <h3>ضمان الخدمة</h3>
                <p>نضمن رضاك الكامل أو نعيد الخدمة مجاناً</p>
              </div>
              <div className="feature-cell">
                <span className="feature-icon">⏱️</span>
                <h3>الالتزام بالمواعيد</h3>
                <p>نحترم وقتك ونلتزم بالمواعيد المحددة</p>
              </div>
              <div className="feature-cell">
                <span className="feature-icon">🛡️</span>
                <h3>مواد آمنة</h3>
                <p>نستخدم مواد معتمدة وآمنة على الأطفال والحيوانات</p>
              </div>
              <div className="feature-cell">
                <span className="feature-icon">👨‍🔧</span>
                <h3>فريق محترف</h3>
                <p>فريق مدرب ومتخصص في جميع الخدمات</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Articles Section with BlogPosting Schema ===== */}
        {articles.length > 0 && (
          <section className="container articles-section">
            <div className="section-title">
              <h2>مقالات ونصائح</h2>
              <div className="line"></div>
              <p>مقالات مفيدة من خبراء نور كلين</p>
            </div>
            <div className="articles-grid">
              {articles.slice(0, 3).map(article => (
                <Link 
                  href={`/articles/${article.slug}`} 
                  key={article.id} 
                  className="article-cell"
                  itemScope
                  itemType="https://schema.org/BlogPosting"
                >
                  <meta itemProp="mainEntityOfPage" content={`${baseUrl}/articles/${article.slug}`} />
                  <meta itemProp="datePublished" content={article.publishedAt} />
                  <meta itemProp="dateModified" content={article.updatedAt || article.publishedAt} />
                  <meta itemProp="author" content={article.author || 'فريق نور كلين'} />
                  
                  <img 
                    src={article.image} 
                    alt={article.seo?.ogTitle || article.title} 
                    className="article-cell-image" 
                    loading="lazy"
                    width="400"
                    height="180"
                    itemProp="image"
                  />
                  <div className="article-cell-content">
                    <span className="article-cell-category" itemProp="articleSection">{article.category}</span>
                    <h3 itemProp="headline">{article.title}</h3>
                    <p itemProp="description">{article.excerpt}</p>
                    <div className="article-cell-meta">
                      <span>📅 {article.publishedAt}</span>
                      <span>⏱️ {article.readTime}</span>
                      <span>اقرأ المزيد →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div style={{textAlign: 'center', marginTop: '40px'}}>
              <Link href="/articles" className="btn btn-primary btn-lg">عرض جميع المقالات</Link>
            </div>
          </section>
        )}
      </Layout>
    </>
  );
}