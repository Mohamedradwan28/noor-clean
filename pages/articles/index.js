import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';

// ===== دوال مساعدة للتواريخ والنصوص =====
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

function truncateText(text, maxLength = 150) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// ===== المكون الرئيسي =====
export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
          const processedArticles = data.map(article => {
            const publishedDate = article.published_at || article.publishedAt || new Date();
            const dateObj = parseDate(publishedDate);
            const isValidDate = !isNaN(dateObj.getTime());
            
            return {
              ...article,
              published_at: publishedDate,
              formattedDate: isValidDate ? formatDate(publishedDate) : 'غير محدد',
              readTime: getReadTime(article.content),
              isoDate: isValidDate ? getISODate(publishedDate) : new Date().toISOString(),
              excerpt: article.excerpt || article.description || truncateText(article.content, 150)
            };
          });
          
          setArticles(processedArticles);
          
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

  // فلترة المقالات
  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seoData.canonical} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <SEO {...seoData} structuredData={{
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "مدونة نور كلين",
        "description": seoData.description,
        "url": seoData.canonical,
        "publisher": { "@type": "Organization", "name": "نور كلين" }
      }} />

      {/* 🎨 Hero Section */}
      <section className="articles-hero" style={{
        background: 'linear-gradient(135deg, #065f46 0%, #10b981 50%, #34d399 100%)',
        color: 'white',
        padding: '80px 20px 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '30px',
            fontSize: '0.9rem',
            marginBottom: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            📚 مدونة نور كلين
          </span>
          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3rem)', 
            marginBottom: '20px',
            fontWeight: '700',
            lineHeight: 1.3
          }}>
            مقالات ونصائح احترافية
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            opacity: 0.95, 
            maxWidth: '650px', 
            margin: '0 auto 30px',
            lineHeight: 1.7
          }}>
            اكتشف أحدث النصائح والحلول من خبراء نور كلين في مجال التنظيف ومكافحة الحشرات بالرياض
          </p>
          
          {/* 🔍 شريط البحث */}
          <div style={{ maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
            <input
              type="search"
              placeholder="ابحث عن مقال..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 20px 16px 50px',
                borderRadius: '50px',
                border: 'none',
                fontSize: '1rem',
                background: 'white',
                color: '#1f2937',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                outline: 'none',
                transition: 'box-shadow 0.2s'
              }}
              onFocus={(e) => e.target.style.boxShadow = '0 15px 50px rgba(0,0,0,0.3)'}
              onBlur={(e) => e.target.style.boxShadow = '0 10px 40px rgba(0,0,0,0.2)'}
            />
            <span style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '1.2rem',
              color: '#6b7280'
            }}>
              🔍
            </span>
          </div>
        </div>
      </section>

      {/* 🏷️ Filters Section */}
      <section className="articles-filters" style={{
        padding: '25px 20px',
        background: 'white',
        borderBottom: '1px solid #f3f4f6',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div className="container" style={{ 
          display: 'flex', 
          gap: '12px', 
          flexWrap: 'wrap', 
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <span style={{ color: '#6b7280', fontSize: '0.9rem', marginLeft: '10px' }}>
            التصنيف:
          </span>
          
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '10px 22px',
              background: selectedCategory === 'all' ? 'linear-gradient(135deg, #10b981, #059669)' : '#f9fafb',
              color: selectedCategory === 'all' ? 'white' : '#374151',
              border: selectedCategory === 'all' ? 'none' : '2px solid #e5e7eb',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              boxShadow: selectedCategory === 'all' ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== 'all') {
                e.target.style.background = '#e5e7eb';
                e.target.style.borderColor = '#10b981';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== 'all') {
                e.target.style.background = '#f9fafb';
                e.target.style.borderColor = '#e5e7eb';
              }
            }}
          >
            ✨ الكل
          </button>
          
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '10px 22px',
                background: selectedCategory === cat ? 'linear-gradient(135deg, #10b981, #059669)' : '#f9fafb',
                color: selectedCategory === cat ? 'white' : '#374151',
                border: selectedCategory === cat ? 'none' : '2px solid #e5e7eb',
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
                boxShadow: selectedCategory === cat ? '0 4px 14px rgba(16, 185, 129, 0.4)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== cat) {
                  e.target.style.background = '#e5e7eb';
                  e.target.style.borderColor = '#10b981';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== cat) {
                  e.target.style.background = '#f9fafb';
                  e.target.style.borderColor = '#e5e7eb';
                }
              }}
            >
              {cat}
            </button>
          ))}
          
          {(searchQuery || selectedCategory !== 'all') && (
            <span style={{
              padding: '8px 16px',
              background: '#ecfdf5',
              color: '#059669',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}>
              {filteredArticles.length} نتيجة
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                style={{
                  marginLeft: '8px',
                  background: 'none',
                  border: 'none',
                  color: '#059669',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                ✕
              </button>
            </span>
          )}
        </div>
      </section>

      {/* 📰 Articles List */}
      <section className="articles-list" style={{ padding: '60px 20px', background: '#fafafa' }}>
        <div className="container">
          
          {/* ⏳ Loading Skeleton */}
          {loading && (
            <div className="articles-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '28px'
            }}>
              {[...Array(6)].map((_, i) => (
                <article key={i} className="article-card skeleton" style={{
                  background: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }}>
                  <div style={{ height: '200px', background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)', backgroundSize: '200% 100%' }} />
                  <div style={{ padding: '24px' }}>
                    <div style={{ height: '20px', width: '30%', background: '#e5e7eb', borderRadius: '10px', marginBottom: '16px' }} />
                    <div style={{ height: '24px', width: '90%', background: '#e5e7eb', borderRadius: '8px', marginBottom: '12px' }} />
                    <div style={{ height: '24px', width: '70%', background: '#e5e7eb', borderRadius: '8px', marginBottom: '20px' }} />
                    <div style={{ height: '16px', width: '100%', background: '#f3f4f6', borderRadius: '6px', marginBottom: '8px' }} />
                    <div style={{ height: '16px', width: '80%', background: '#f3f4f6', borderRadius: '6px' }} />
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* ❌ Error State */}
          {error && !loading && (
            <div style={{
              background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
              border: '2px solid #fecaca',
              color: '#dc2626',
              padding: '30px',
              borderRadius: '20px',
              textAlign: 'center',
              maxWidth: '500px',
              margin: '60px auto',
              boxShadow: '0 10px 40px rgba(220, 38, 38, 0.1)'
            }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '15px' }}>😕</span>
              <p style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '10px' }}>حدث خطأ أثناء تحميل المقالات</p>
              <p style={{ color: '#991b1b', marginBottom: '20px', fontSize: '0.95rem' }}>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                style={{
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '1rem',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 14px rgba(220, 38, 38, 0.3)';
                }}
              >
                🔄 إعادة المحاولة
              </button>
            </div>
          )}

          {/* 📭 Empty State */}
          {!loading && !error && filteredArticles.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '80px 20px',
              background: 'white',
              borderRadius: '24px',
              margin: '20px auto',
              maxWidth: '500px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <span style={{ fontSize: '4rem', display: 'block', marginBottom: '20px' }}>{searchQuery ? '🔍' : '📭'}</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد مقالات حالياً'}
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '25px', lineHeight: 1.6 }}>
                {searchQuery ? 'جرب كلمات بحث أخرى أو تصفح جميع المقالات' : 'تابعنا لنشر أحدث المقالات والنصائح في مجال التنظيف'}
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    style={{
                      padding: '12px 24px',
                      background: '#f3f4f6',
                      color: '#374151',
                      border: 'none',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                    onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                  >
                    مسح البحث
                  </button>
                )}
                <Link 
                  href="/contact"
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: '500',
                    display: 'inline-block',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 14px rgba(16, 185, 129, 0.3)';
                  }}
                >
                  اتصل بنا 💬
                </Link>
              </div>
            </div>
          )}

          {/* ✅ Articles Grid */}
          {!loading && !error && filteredArticles.length > 0 && (
            <div className="articles-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '28px'
            }}>
              {filteredArticles.map((article, index) => (
                <article 
                  key={article.id} 
                  className="article-card"
                  style={{
                    background: 'white',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    animation: `fadeInUp 0.4s ease forwards`,
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0,
                    transform: 'translateY(20px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                  }}
                >
                  {/* 🖼️ Article Image */}
                  {article.image && (
                    <div style={{ position: 'relative', height: '210px', overflow: 'hidden' }}>
                      <img 
                        src={article.image} 
                        alt={article.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s ease'
                        }}
                        loading="lazy"
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '60px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)'
                      }} />
                      {article.category && (
                        <span style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          padding: '6px 14px',
                          background: 'rgba(255,255,255,0.95)',
                          color: '#059669',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                          {article.category}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* 📝 Article Content */}
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '700',
                      color: '#111827',
                      marginBottom: '12px',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {article.title}
                    </h3>
                    
                    <p style={{
                      color: '#6b7280',
                      fontSize: '0.95rem',
                      lineHeight: 1.7,
                      marginBottom: '20px',
                      flex: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {article.excerpt}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '18px',
                      borderTop: '1px solid #f3f4f6',
                      fontSize: '0.85rem',
                      color: '#9ca3af'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>📅 {article.formattedDate}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>⏱️ {article.readTime}</span>
                    </div>
                    
                    {/* ✅ Read More Link - مصحح تماماً */}
                    <Link 
                      href={`/articles/${article.slug}`}
                      className="read-more-link"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginTop: '18px',
                        color: '#10b981',
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        textDecoration: 'none',
                        transition: 'gap 0.2s ease, transform 0.2s ease',
                        alignSelf: 'flex-start',
                        cursor: 'pointer'
                      }}
                    >
                      اقرأ المقال
                      <span 
                        className="read-more-arrow" 
                        style={{ 
                          transition: 'transform 0.2s ease',
                          display: 'inline-block'
                        }}
                      >
                        ←
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 📢 CTA Section */}
      <section className="articles-cta" style={{
        background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
        color: 'white',
        padding: '70px 20px',
        textAlign: 'center'
      }}>
        <div className="container">
          <span style={{
            display: 'inline-block',
            padding: '8px 20px',
            background: 'rgba(16, 185, 129, 0.2)',
            color: '#34d399',
            borderRadius: '30px',
            fontSize: '0.9rem',
            fontWeight: '500',
            marginBottom: '20px'
          }}>
            💡 تحتاج مساعدة؟
          </span>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '18px', fontWeight: '700' }}>
            فريق نور كلين جاهز لخدمتك
          </h2>
          <p style={{ color: '#9ca3af', marginBottom: '30px', maxWidth: '550px', margin: '0 auto 30px', lineHeight: 1.7, fontSize: '1.05rem' }}>
            سواء كنت تبحث عن خدمة تنظيف أو مكافحة حشرات، نحن هنا لتقديم أفضل الحلول باحترافية وجودة عالية
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link 
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 36px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                borderRadius: '14px',
                fontWeight: '600',
                fontSize: '1rem',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.boxShadow = '0 15px 35px rgba(16, 185, 129, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
              }}
            >
              📞 احجز الآن
            </Link>
            <Link 
              href="/services"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 36px',
                background: 'transparent',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '14px',
                fontWeight: '600',
                fontSize: '1rem',
                textDecoration: 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
                e.target.style.borderColor = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
            >
              🧹 خدماتنا
            </Link>
          </div>
        </div>
      </section>

      {/* 🎬 CSS Animations & Styles */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* ✅ Read More Link Effects */
        .read-more-link {
          gap: 8px !important;
          transition: gap 0.2s ease, transform 0.2s ease, color 0.2s ease;
        }
        
        .read-more-link:hover {
          gap: 12px !important;
          color: #059669 !important;
        }
        
        .read-more-link:hover .read-more-arrow {
          transform: translateX(-4px);
        }
        
        /* ✅ Article Card Hover */
        .article-card {
          will-change: transform, box-shadow;
          backface-visibility: hidden;
        }
        
        .article-card img {
          will-change: transform;
          transition: transform 0.5s ease;
        }
        
        .article-card:hover img {
          transform: scale(1.05);
        }
        
        /* ✅ Responsive Design */
        @media (max-width: 768px) {
          .articles-grid {
            grid-template-columns: 1fr !important;
          }
          .articles-hero {
            padding: 60px 15px 40px !important;
          }
          .articles-hero h1 {
            font-size: 2rem !important;
          }
          .articles-filters {
            padding: 15px !important;
          }
          .articles-filters .container {
            gap: 8px !important;
          }
          .articles-filters button {
            padding: 8px 16px !important;
            font-size: 0.85rem !important;
          }
          .article-card {
            border-radius: 16px !important;
          }
          .article-card .container {
            padding: 20px !important;
          }
        }
        
        @media (max-width: 480px) {
          .articles-hero h1 {
            font-size: 1.75rem !important;
          }
          .articles-hero p {
            font-size: 1rem !important;
          }
          .article-card h3 {
            font-size: 1.1rem !important;
          }
          .article-card p {
            font-size: 0.9rem !important;
          }
        }
        
        /* ✅ Loading Skeleton */
        .skeleton {
          animation: pulse 1.5s ease-in-out infinite;
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
        }
        
        /* ✅ Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
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
        
        /* ✅ Selection Color */
        ::selection {
          background: #10b981;
          color: white;
        }
        
        /* ✅ Focus Outline for Accessibility */
        :focus-visible {
          outline: 2px solid #10b981;
          outline-offset: 2px;
          border-radius: 4px;
        }
        
        /* ✅ Smooth Scroll */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </Layout>
  );
}