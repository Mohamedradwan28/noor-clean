import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Link from 'next/link';

export default function ServicePage() {
  const router = useRouter();
  const { slug } = router.query;
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    if (slug) {
      Promise.all([
        fetch('/api/services').then(res => res.json()),
        fetch('/api/settings').then(res => res.json())
      ]).then(([servicesData, settingsData]) => {
        const found = servicesData.find(s => s.slug === slug);
        setService(found);
        setSettings(settingsData);
        setLoading(false);
      });
    }
  }, [slug]);

  // Prepare SEO data
  const baseUrl = settings.seo?.canonical || 'https://noorclean.com';
  const serviceUrl = `${baseUrl}/services/${service?.slug}`;
  const serviceTitle = service?.seo?.metaTitle || `${service?.title} | ${settings.siteName || 'نور كلين'}`;
  const serviceDescription = service?.seo?.metaDescription || service?.shortDescription || service?.description || '';
  const serviceKeywords = service?.seo?.keywords || `${service?.title}, ${service?.category}, الرياض, نور كلين`;
  const serviceImage = service?.image || `${baseUrl}/og-image.jpg`;

  // ===== Structured Data: Service Schema =====
  const serviceSchema = service ? {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": serviceUrl,
    "name": service.title,
    "description": service.shortDescription || service.description,
    "provider": {
      "@type": "LocalBusiness",
      "name": settings.siteName || 'نور كلين',
      "image": `${baseUrl}/logo.png`,
      "telephone": settings.phone || '966500000000',
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "الرياض",
        "addressCountry": "SA"
      },
      "priceRange": "$$"
    },
    "areaServed": {
      "@type": "City",
      "name": "الرياض"
    },
    "serviceType": service.category || 'خدمة تنظيف',
    "offers": {
      "@type": "Offer",
      "priceCurrency": "SAR",
      "priceSpecification": service.price || undefined,
      "availability": "https://schema.org/InStock",
      "url": serviceUrl
    },
    "image": serviceImage,
    "url": serviceUrl,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "5000",
      "bestRating": "5",
      "worstRating": "1"
    }
  } : null;

  // ===== Structured Data: Breadcrumb Schema =====
  const breadcrumbSchema = service ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "الرئيسية",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "الخدمات",
        "item": `${baseUrl}/#services`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": service.title,
        "item": serviceUrl
      }
    ]
  } : null;

  // ===== Structured Data: FAQ Schema (Dynamic from content) =====
  const faqSchema = service ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `ما هي خدمة ${service.title}؟`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": service.shortDescription || service.description
        }
      },
      {
        "@type": "Question",
        "name": `هل تقدمون ضمان على خدمة ${service.title}؟`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نعم، نقدم ضمان كامل على جميع خدماتنا مع إمكانية المتابعة المجانية لضمان رضا العملاء."
        }
      },
      {
        "@type": "Question",
        "name": `ما هي مناطق الخدمة في الرياض لـ ${service.title}؟`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نغطي جميع أحياء الرياض بما في ذلك: النرجس، الياسمين، الملقا، العليا، السويدي، والورود."
        }
      }
    ]
  } : null;

  // Loading state
  if (loading) {
    return (
      <Layout>
        <Head>
          <title>جاري التحميل... | {settings.siteName || 'نور كلين'}</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="loading"><div className="loading-spinner"></div></div>
      </Layout>
    );
  }

  // Not found state
  if (!service) {
    return (
      <Layout>
        <Head>
          <title>الخدمة غير موجودة | {settings.siteName || 'نور كلين'}</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="container" style={{textAlign: 'center', padding: '100px 20px'}}>
          <h1 style={{fontSize: '2rem', color: 'var(--gray-600)', marginBottom: '20px'}}>😕 الخدمة غير موجودة</h1>
          <Link href="/" className="btn btn-primary">العودة للرئيسية</Link>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        {/* ===== Basic Meta Tags ===== */}
        <title>{serviceTitle}</title>
        <meta name="description" content={serviceDescription} />
        <meta name="keywords" content={serviceKeywords} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href={serviceUrl} />
        <meta name="author" content={settings.siteName || 'نور كلين'} />
        
        {/* ===== Language & Region ===== */}
        <meta httpEquiv="content-language" content="ar-SA" />
        <meta name="geo.region" content="SA-01" />
        <meta name="geo.placename" content="الرياض" />
        
        {/* ===== Open Graph / Facebook ===== */}
        <meta property="og:type" content="service" />
        <meta property="og:url" content={serviceUrl} />
        <meta property="og:title" content={serviceTitle} />
        <meta property="og:description" content={serviceDescription} />
        <meta property="og:image" content={serviceImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={service.title} />
        <meta property="og:locale" content="ar_SA" />
        <meta property="og:site_name" content={settings.siteName || 'نور كلين'} />
        
        {/* ===== Twitter Card ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={serviceUrl} />
        <meta name="twitter:title" content={serviceTitle} />
        <meta name="twitter:description" content={serviceDescription} />
        <meta name="twitter:image" content={serviceImage} />
        
        {/* ===== Preload Critical Image ===== */}
        <link rel="preload" href={serviceImage} as="image" />
        
        {/* ===== Structured Data - JSON-LD ===== */}
        {serviceSchema && (
          <script 
            type="application/ld+json" 
            dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} 
          />
        )}
        {breadcrumbSchema && (
          <script 
            type="application/ld+json" 
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} 
          />
        )}
        {faqSchema && (
          <script 
            type="application/ld+json" 
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} 
          />
        )}
      </Head>

      <Layout title={serviceTitle}>
        <div className="container service-page">
          <article 
            className="service-article" 
            itemScope 
            itemType="https://schema.org/Service"
          >
            {/* Schema Microdata */}
            <meta itemProp="name" content={service.title} />
            <meta itemProp="description" content={service.shortDescription} />
            <meta itemProp="serviceType" content={service.category} />
            
            <span className="service-cell-category" itemProp="category">{service.category}</span>
            
            <h1 itemProp="name">{service.title}</h1>
            
            <img 
              src={service.image} 
              alt={service.seo?.ogTitle || service.title} 
              className="service-article-image"
              itemProp="image"
              width="1200"
              height="630"
              loading="eager"
            />
            
            <div 
              className="service-article-description" 
              itemProp="description"
            >
              {service.shortDescription}
            </div>
            
            <div className="service-article-content" itemProp="serviceOutput">
              {service.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('##')) {
                  return <h2 key={index} itemProp="serviceType">{paragraph.replace('##', '')}</h2>;
                }
                if (paragraph.startsWith('###')) {
                  return <h3 key={index}>{paragraph.replace('###', '')}</h3>;
                }
                if (paragraph.startsWith('-')) {
                  return <li key={index} style={{marginRight: '20px'}} itemProp="serviceArea">{paragraph.replace('-', '')}</li>;
                }
                return paragraph ? <p key={index}>{paragraph}</p> : null;
              })}
            </div>
            
            {service.features && service.features.length > 0 && (
              <div 
                style={{background: 'var(--gray-50)', padding: '30px', borderRadius: 'var(--radius-lg)', margin: '40px 0'}}
                itemProp="offers"
                itemScope
                itemType="https://schema.org/Offer"
              >
                <meta itemProp="priceCurrency" content="SAR" />
                <meta itemProp="availability" content="https://schema.org/InStock" />
                
                <h3 style={{marginBottom: '20px', color: 'var(--secondary)'}}>✨ مميزات الخدمة</h3>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center'}}>
                  {service.features.map((feature, i) => (
                    <span 
                      key={i} 
                      style={{background: 'var(--gray-100)', color: 'var(--gray-700)', padding: '10px 20px', borderRadius: 'var(--radius-full)', fontSize: '1rem', fontWeight: '600'}}
                      itemProp="additionalType"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Price if available */}
            {service.price && (
              <div style={{textAlign: 'center', margin: '30px 0'}}>
                <span 
                  style={{background: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '12px 30px', borderRadius: 'var(--radius-full)', fontWeight: '700', fontSize: '1.2rem'}}
                  itemProp="offers"
                  itemScope
                  itemType="https://schema.org/Offer"
                >
                  <meta itemProp="priceCurrency" content="SAR" />
                  <span itemProp="priceSpecification">{service.price}</span>
                </span>
              </div>
            )}
            
            {/* Call to Action */}
            <div style={{textAlign: 'center', marginTop: '50px'}}>
              <Link 
                href="/contact" 
                className="btn btn-primary btn-lg"
                itemProp="potentialAction"
                itemScope
                itemType="https://schema.org/ReserveAction"
              >
                <meta itemProp="target" content={`${baseUrl}/contact`} />
                📞 احجز هذه الخدمة الآن
              </Link>
              <a 
                href={`https://wa.me/${settings.whatsapp || '966500000000'}?text=أريد الاستفسار عن ${encodeURIComponent(service.title)}`} 
                className="btn btn-lg" 
                style={{background: '#25d366', color: 'white', marginRight: '15px'}} 
                target="_blank" 
                rel="noopener noreferrer"
                itemProp="potentialAction"
                itemScope
                itemType="https://schema.org/CommunicateAction"
              >
                💬 اطلب عبر واتساب
              </a>
            </div>
            
            {/* Service Area */}
            <div style={{marginTop: '50px', paddingTop: '30px', borderTop: '1px solid var(--gray-200)'}} itemProp="areaServed" itemScope itemType="https://schema.org/City">
              <meta itemProp="name" content="الرياض" />
              <p style={{color: 'var(--gray-600)', fontSize: '0.95rem'}}>
                📍 نخدم جميع أحياء الرياض: النرجس، الياسمين، الملقا، العليا، السويدي، الورود، وغيرها.
              </p>
            </div>
          </article>
        </div>
      </Layout>
    </>
  );
}