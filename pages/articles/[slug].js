import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';

// ===== دوال مساعدة =====
function parseDate(dateValue) {
  if (!dateValue) return new Date();
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? new Date() : date;
}

function formatDate(dateValue, locale = 'ar-EG') {
  const date = parseDate(dateValue);
  // ✅ بدون وقت - فقط تاريخ
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getReadTime(content) {
  if (!content) return '1 دقيقة';
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} دقيقة قراءة`;
}

// ===== المكون الرئيسي =====
export default function ArticlePage() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [article, setArticle] = useState(null);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  // جلب المقال والإعدادات
  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // جلب المقال بالـ slug مباشرة
        const articleRes = await fetch(`/api/articles?slug=${slug}`);
        
        if (!articleRes.ok) {
          throw new Error(`HTTP error! status: ${articleRes.status}`);
        }
        
        const articleData = await articleRes.json();
        
        // ⚠️ التعامل مع مصفوفة أو Object
        const found = Array.isArray(articleData) 
          ? articleData.find(a => a.slug === slug) 
          : (articleData?.slug === slug ? articleData : null);
        
        if (!found) {
          throw new Error('المقال غير موجود');
        }
        
        // معالجة المقال
        const publishedDate = found.published_at || found.publishedAt || new Date();
        const dateObj = parseDate(publishedDate);
        const isValidDate = !isNaN(dateObj.getTime());
        
        const processedArticle = {
          ...found,
          published_at: publishedDate,
          formattedDate: isValidDate ? formatDate(publishedDate) : 'غير محدد',
          readTime: getReadTime(found.content),
          tags: Array.isArray(found.tags) ? found.tags : (found.tags ? JSON.parse(found.tags) : [])
        };
        
        setArticle(processedArticle);
        
        // جلب الإعدادات
        const settingsRes = await fetch('/api/settings');
        if (settingsRes.ok) {
          const settingsData = await settingsRes.json();
          setSettings(settingsData);
        }
        
        // جلب مقالات ذات صلة
        if (processedArticle.category) {
          const relatedRes = await fetch(`/api/articles?category=${processedArticle.category}`);
          if (relatedRes.ok) {
            const relatedData = await relatedRes.json();
            const related = Array.isArray(relatedData) 
              ? relatedData.filter(a => a.id !== processedArticle.id && a.active).slice(0, 3)
              : [];
            setRelatedArticles(related);
          }
        }
        
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug]);

  // SEO Data
  const seoData = article ? {
    title: `${article.title} | نور كلين`,
    description: article.excerpt || article.short_description || settings.seo_defaultDescription,
    keywords: article.tags?.join(', ') || settings.seo_defaultKeywords,
    canonical: `https://noorclean.com/articles/${article.slug}`,
    image: article.image
  } : {
    title: 'جاري التحميل... | نور كلين',
    description: settings.seo_defaultDescription,
    keywords: settings.seo_defaultKeywords,
    canonical: 'https://noorclean.com/articles'
  };

  // Loading State
  if (loading) {
    return (
      <Layout>
        <Head>
          <title>{seoData.title}</title>
        </Head>
        <div style={{ 
          minHeight: '60vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '40px 20px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #10b981',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <p style={{ color: '#6b7280' }}>جاري تحميل المقال...</p>
          </div>
        </div>
        <style jsx>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </Layout>
    );
  }

  // Error State
  if (error || !article) {
    return (
      <Layout>
        <Head>
          <title>المقال غير موجود | نور كلين</title>
        </Head>
        <div style={{ 
          minHeight: '60vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <div>
            <span style={{ fontSize: '4rem', display: 'block', marginBottom: '20px' }}>😕</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '10px', color: '#1f2937' }}>
              المقال غير موجود
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '25px' }}>
              {error || 'عذراً، لم نتمكن من العثور على هذا المقال'}
            </p>
            <Link 
              href="/articles"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'transform 0.2s'
              }}
            >
              ← العودة للمقالات
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={seoData.canonical} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={seoData.canonical} />
        {seoData.image && <meta property="og:image" content={seoData.image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        {seoData.image && <meta name="twitter:image" content={seoData.image} />}
      </Head>

      <SEO {...seoData} structuredData={{
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": article.title,
        "description": seoData.description,
        "image": article.image,
        "author": { "@type": "Organization", "name": "نور كلين" },
        "publisher": { "@type": "Organization", "name": "نور كلين" },
        "datePublished": article.isoDate || new Date().toISOString(),
        "dateModified": article.updated_at || article.isoDate || new Date().toISOString(),
        "mainEntityOfPage": seoData.canonical,
        "articleSection": article.category,
        "keywords": article.tags?.join(', ')
      }} />

      {/* 🎨 Article Hero */}
      <article className="article-page">
        {article.image && (
          <div style={{
            height: '400px',
            background: `linear-gradient(135deg, rgba(6,95,70,0.9), rgba(16,185,129,0.7)), url(${article.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '40px 20px'
          }}>
            <div style={{ color: 'white', maxWidth: '800px' }}>
              {article.category && (
                <span style={{
                  display: 'inline-block',
                  padding: '6px 16px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '500',
                  marginBottom: '15px',
                  backdropFilter: 'blur(10px)'
                }}>
                  {article.category}
                </span>
              )}
              <h1 style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                fontWeight: '700',
                lineHeight: 1.4,
                marginBottom: '15px',
                textShadow: '0 2px 10px rgba(0,0,0,0.2)'
              }}>
                {article.title}
              </h1>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                fontSize: '0.9rem',
                opacity: 0.95
              }}>
                <span>📅 {article.formattedDate}</span>
                <span>⏱️ {article.readTime}</span>
              </div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="container" style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '40px 20px'
        }}>
          {article.tags?.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              marginBottom: '30px',
              paddingBottom: '25px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              {article.tags.map((tag, index) => (
                <span key={index} style={{
                  padding: '6px 14px',
                  background: '#ecfdf5',
                  color: '#059669',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '500'
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div 
            className="article-content"
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: '#374151',
              direction: 'rtl'
            }}
            dangerouslySetInnerHTML={{ 
              __html: article.content
                ?.replace(/^# (.*$)/gim, '<h2 style="font-size:1.5rem;font-weight:700;color:#111827;margin:30px 0 15px">$1</h2>')
                .replace(/^## (.*$)/gim, '<h3 style="font-size:1.25rem;font-weight:600;color:#1f2937;margin:25px 0 12px">$1</h3>')
                .replace(/\*\*(.*?)\*\*/gim, '<strong style="color:#059669">$1</strong>')
                .replace(/\n/gim, '<br/>')
            }} 
          />

          {/* Share Buttons */}
          <div style={{
            marginTop: '50px',
            paddingTop: '25px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>شارك المقال:</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a 
                href={`https://wa.me/?text=${encodeURIComponent(seoData.title + ' ' + seoData.canonical)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 20px',
                  background: '#25D366',
                  color: 'white',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                💬 واتساب
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(seoData.title)}&url=${encodeURIComponent(seoData.canonical)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 20px',
                  background: '#1DA1F2',
                  color: 'white',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                🐦 تويتر
              </a>
            </div>
          </div>

          {/* Back to Articles */}
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <Link 
              href="/articles"
              style={{
                color: '#10b981',
                fontWeight: '500',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ← العودة لجميع المقالات
            </Link>
          </div>
        </div>

        {/* 🔗 Related Articles */}
        {relatedArticles.length > 0 && (
          <section style={{
            background: '#f9fafb',
            padding: '60px 20px',
            marginTop: '40px'
          }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '30px',
                textAlign: 'center'
              }}>
                📚 مقالات ذات صلة
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                {relatedArticles.map(related => (
                  <Link 
                    key={related.id}
                    href={`/articles/${related.slug}`}
                    style={{
                      display: 'block',
                      background: 'white',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      textDecoration: 'none',
                      color: 'inherit',
                      transition: 'transform 0.2s'
                    }}
                  >
                    {related.image && (
                      <div style={{ height: '160px', overflow: 'hidden' }}>
                        <img 
                          src={related.image} 
                          alt={related.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div style={{ padding: '20px' }}>
                      <h4 style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '10px',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {related.title}
                      </h4>
                      <p style={{
                        color: '#6b7280',
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                        marginBottom: '15px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {related.excerpt || related.short_description}
                      </p>
                      <span style={{ color: '#10b981', fontWeight: '500', fontSize: '0.9rem' }}>
                        اقرأ المزيد ←
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 📢 CTA Section */}
        <section style={{
          background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
          color: 'white',
          padding: '50px 20px',
          textAlign: 'center'
        }}>
          <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '15px' }}>
              هل استفدت من هذا المقال؟
            </h3>
            <p style={{ color: '#9ca3af', marginBottom: '25px', lineHeight: 1.7 }}>
              فريق نور كلين جاهز لمساعدتك في جميع خدمات التنظيف ومكافحة الحشرات بالرياض
            </p>
            <Link 
              href="/contact"
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                borderRadius: '12px',
                fontWeight: '600',
                textDecoration: 'none'
              }}
            >
              📞 احجز خدمتك الآن
            </Link>
          </div>
        </section>
      </article>

      {/* CSS Styles */}
      <style jsx global>{`
        .article-content h2 {
          font-size: 1.5rem !important;
          font-weight: 700 !important;
          color: #111827 !important;
          margin: 30px 0 15px !important;
        }
        .article-content h3 {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          color: #1f2937 !important;
          margin: 25px 0 12px !important;
        }
        .article-content strong {
          color: #059669 !important;
        }
        .article-content p {
          margin: 15px 0 !important;
        }
        .article-content ul,
        .article-content ol {
          margin: 15px 0 !important;
          padding-right: 25px !important;
        }
        .article-content li {
          margin: 8px 0 !important;
          line-height: 1.7 !important;
        }
        .article-content a {
          color: #10b981 !important;
          text-decoration: none !important;
        }
        .article-content a:hover {
          color: #059669 !important;
          text-decoration: underline !important;
        }
        .article-content img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 12px !important;
          margin: 20px 0 !important;
        }
        .article-content blockquote {
          border-right: 4px solid #10b981 !important;
          padding: 15px 20px !important;
          margin: 25px 0 !important;
          background: #ecfdf5 !important;
          border-radius: 0 8px 8px 0 !important;
          color: #065f46 !important;
          font-style: italic !important;
        }
        @media (max-width: 768px) {
          .article-page .container {
            padding: 30px 15px !important;
          }
          .article-content {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </Layout>
  );
}