import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';

// ===== دوال مساعدة للتواريخ =====
function parseDate(dateValue) {
  if (!dateValue) return new Date();
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? new Date() : date;
}

function formatDate(dateValue, locale = 'ar-EG') {
  const date = parseDate(dateValue);
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

function getISODate(dateValue) {
  return parseDate(dateValue).toISOString();
}

// ===== المكون الرئيسي =====
export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // جلب المقالات من API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('/api/articles');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (Array.isArray(data)) {
          // معالجة المقالات بأمان
          const processedArticles = data.map(article => {
            // ⚠️ Supabase بيرجع published_at (snake_case)
            const publishedDate = article.published_at || article.publishedAt || new Date();
            const dateObj = parseDate(publishedDate);
            const isValidDate = !isNaN(dateObj.getTime());
            
            return {
              ...article,
              published_at: publishedDate,
              formattedDate: isValidDate ? formatDate(publishedDate) : 'غير محدد',
              readTime: getReadTime(article.content),
              isoDate: isValidDate ? getISODate(publishedDate) : new Date().toISOString(),
              excerpt: article.excerpt || article.description || article.content?.substring(0, 150) + '...'
            };
          });
          
          setArticles(processedArticles);
          
          // استخراج التصنيفات الفريدة
          const uniqueCategories = [...new Set(
            processedArticles
              .map(a => a.category)
              .filter(c => c && c.trim())
          )];
          setCategories(uniqueCategories);
          
        } else {
          console.error('البيانات مش مصفوفة:', data);
          setArticles([]);
        }
        
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError(err.message);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, []);

  // فلترة المقالات حسب التصنيف
  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory);

  // SEO Data
  const seoData = {
    title: 'مقالات ونصائح | نور كلين',
    description: 'مقالات مفيدة حول التنظيف ومكافحة الحشرات من خبراء نور كلين',
    keywords: 'مقالات, تنظيف, مكافحة حشرات, نصائح, الرياض, نور كلين',
    canonical: 'https://noorclean.com/articles'
  };

  return (
    <Layout>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <link rel="canonical" href={seoData.canonical} />
        
        {/* Open Graph */}
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seoData.canonical} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
      </Head>

      {/* Schema.org Structured Data */}
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonical={seoData.canonical}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "مدونة نور كلين",
          "description": seoData.description,
          "url": seoData.canonical,
          "publisher": {
            "@type": "Organization",
            "name": "نور كلين",
            "logo": {
              "@type": "ImageObject",
              "url": "https://noorclean.com/logo.png"
            }
          }
        }}
      />

      {/* Hero Section */}
      <section className="articles-hero" style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>📰 مقالات ونصائح</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
            اكتشف أحدث النصائح والحلول من خبراء نور كلين في مجال التنظيف ومكافحة الحشرات
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="articles-filters" style={{
        padding: '30px 20px',
        background: '#f9fafb',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div className="container" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '10px 20px',
              background: selectedCategory === 'all' ? '#10b981' : 'white',
              color: selectedCategory === 'all' ? 'white' : '#374151',
              border: '2px solid #10b981',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            الكل
          </button>
          
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '10px 20px',
                background: selectedCategory === cat ? '#10b981' : 'white',
                color: selectedCategory === cat ? 'white' : '#374151',
                border: '2px solid #10b981',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Articles List */}
      <section className="articles-list" style={{ padding: '50px 20px' }}>
        <div className="container">
          
          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="loading-spinner" style={{
                width: '40px',
                height: '40px',
                border: '4px solid #e5e7eb',
                borderTop: '4px solid #10b981',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 20px'
              }}></div>
              <p style={{ color: '#6b7280' }}>جاري تحميل المقالات...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div style={{
              background: '#fef2f2',
              color: '#dc2626',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <p>❌ حدث خطأ: {error}</p>
              <button 
                onClick={() => window.location.reload()}
                style={{
                  marginTop: '15px',
                  padding: '10px 20px',
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredArticles.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '1.2rem', color: '#6b7280', marginBottom: '20px' }}>
                😕 لا توجد مقالات في هذا التصنيف
              </p>
              <Link href="/contact" style={{ color: '#10b981', fontWeight: '500' }}>
                اتصل بنا لاقتراح موضوع ←
              </Link>
            </div>
          )}

          {/* Articles Grid */}
          {!loading && !error && filteredArticles.length > 0 && (
            <div className="articles-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '25px'
            }}>
              {filteredArticles.map(article => (
                <article key={article.id} className="article-card" style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                }}
                >
                  {/* Article Image */}
                  {article.image && (
                    <div style={{ height: '200px', overflow: 'hidden' }}>
                      <img 
                        src={article.image} 
                        alt={article.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s'
                        }}
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  {/* Article Content */}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Category Badge */}
                    {article.category && (
                      <span style={{
                        display: 'inline-block',
                        padding: '5px 12px',
                        background: '#ecfdf5',
                        color: '#059669',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        marginBottom: '12px',
                        width: 'fit-content'
                      }}>
                        {article.category}
                      </span>
                    )}
                    
                    {/* Title */}
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '10px',
                      lineHeight: '1.4'
                    }}>
                      {article.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      marginBottom: '15px',
                      flex: 1
                    }}>
                      {article.excerpt}
                    </p>
                    
                    {/* Meta */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '15px',
                      borderTop: '1px solid #e5e7eb',
                      fontSize: '0.85rem',
                      color: '#9ca3af'
                    }}>
                      <span>📅 {article.formattedDate}</span>
                      <span>⏱️ {article.readTime}</span>
                    </div>
                    
                    {/* Read More Link */}
                    <Link 
                      href={`/articles/${article.slug}`}
                      style={{
                        display: 'inline-block',
                        marginTop: '15px',
                        color: '#10b981',
                        fontWeight: '500',
                        textDecoration: 'none'
                      }}
                    >
                      اقرأ المزيد ←
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="articles-cta" style={{
        background: '#f9fafb',
        padding: '50px 20px',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#111827' }}>
            هل تبحث عن خدمة معينة؟
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '25px', maxWidth: '500px', margin: '0 auto 25px' }}>
            فريق نور كلين جاهز لمساعدتك في جميع خدمات التنظيف ومكافحة الحشرات
          </p>
          <Link 
            href="/contact"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              background: '#10b981',
              color: 'white',
              borderRadius: '12px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#059669'}
            onMouseLeave={(e) => e.target.style.background = '#10b981'}
          >
            احجز خدمتك الآن 📞
          </Link>
        </div>
      </section>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Layout>
  );
}