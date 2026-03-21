import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Link from 'next/link';
import Head from 'next/head';

// ===== دالة تنسيق التاريخ بالعربية =====
function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // تنسيق التاريخ بالعربية
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  };
  
  return date.toLocaleDateString('ar-SA', options);
}

// ===== دالة حساب وقت القراءة الواقعي =====
function getReadTime(content) {
  if (!content) return 'دقيقة واحدة';
  
  const WORDS_PER_MINUTE = 220;
  const words = content
    .replace(/[^\w\s\u0600-\u06FF]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(w => w.length > 2);
  
  const minutes = Math.round(words.length / WORDS_PER_MINUTE);
  
  if (minutes <= 1) return 'دقيقة واحدة';
  if (minutes === 2) return 'دقيقتان';
  if (minutes <= 10) return `${minutes} دقائق`;
  return `${minutes} دقيقة`;
}

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    Promise.all([
      fetch('/api/articles').then(res => res.json()),
      fetch('/api/settings').then(res => res.json())
    ]).then(([articlesData, settingsData]) => {
      // معالجة كل مقال بإضافة تواريخ منسقة ووقت قراءة واقعي
      const processedArticles = articlesData
        .filter(a => a.active)
        .map(article => ({
          ...article,
          formattedDate: formatDate(article.publishedAt),
          readTime: getReadTime(article.content),
          isoDate: new Date(article.publishedAt).toISOString()
        }));
      
      setArticles(processedArticles);
      setSettings(settingsData);
      setLoading(false);
    });
  }, []);

  // ===== إعدادات الـ SEO =====
  const baseUrl = settings.seo?.canonical || 'https://noorclean.com';
  const articlesUrl = `${baseUrl}/articles`;
  const pageTitle = `المقالات والنصائح | ${settings.siteName || 'نور كلين'}`;
  const pageDescription = 'مقالات ونصائح احترافية من خبراء نور كلين في مجال التنظيف، مكافحة الحشرات، والصيانة';

  // ===== Schema للمقالات =====
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "مدونة نور كلين",
    "url": articlesUrl,
    "description": pageDescription,
    "inLanguage": "ar-SA",
    "publisher": {
      "@type": "Organization",
      "name": settings.siteName || 'نور كلين',
      "logo": `${baseUrl}/logo.png`
    },
    "blogPost": articles.slice(0, 10).map(article => ({
      "@type": "BlogPosting",
      "headline": article.title,
      "description": article.excerpt,
      "url": `${articlesUrl}/${article.slug}`,
      "datePublished": article.isoDate,
      "dateModified": article.isoDate,
      "author": {
        "@type": "Person",
        "name": article.author || 'فريق نور كلين'
      },
      "image": article.image,
      "articleSection": article.category,
      "timeRequired": `PT${article.readTime.split(' ')[0]}M`
    }))
  };

  return (
    <>
      <Head>
        {/* ===== Basic Meta Tags ===== */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="مقالات تنظيف, نصائح منزلية, مكافحة حشرات, صيانة, الرياض, نور كلين" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href={articlesUrl} />
        
        {/* ===== Open Graph ===== */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={articlesUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={`${baseUrl}/og-image.jpg`} />
        <meta property="og:locale" content="ar_SA" />
        
        {/* ===== Twitter Card ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
        {/* ===== Structured Data ===== */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
      </Head>

      <Layout title={pageTitle}>
        <div className="container articles-section">
          <div className="section-title">
            <h2>📰 المقالات والنصائح</h2>
            <div className="line"></div>
            <p>مقالات مفيدة من خبراء نور كلين لمساعدتك في الحفاظ على منزلك</p>
          </div>

          {loading ? (
            <div className="loading"><div className="loading-spinner"></div></div>
          ) : articles.length > 0 ? (
            <div className="articles-grid">
              {articles.map(article => (
                <Link 
                  href={`/articles/${article.slug}`} 
                  key={article.id} 
                  className="article-cell"
                  itemScope
                  itemType="https://schema.org/BlogPosting"
                >
                  {/* Schema Microdata */}
                  <meta itemProp="headline" content={article.title} />
                  <meta itemProp="description" content={article.excerpt} />
                  <meta itemProp="datePublished" content={article.isoDate} />
                  <meta itemProp="author" content={article.author || 'فريق نور كلين'} />
                  <meta itemProp="articleSection" content={article.category} />
                  
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="article-cell-image" 
                    loading="lazy"
                    itemProp="image"
                  />
                  
                  <div className="article-cell-content">
                    <span className="article-cell-category" itemProp="articleSection">
                      {article.category}
                    </span>
                    
                    <h3 itemProp="headline">{article.title}</h3>
                    
                    <p itemProp="description">{article.excerpt}</p>
                    
                    <div className="article-cell-meta">
                      {/* تاريخ حقيقي ومنسق مع Schema */}
                      <span>
                        📅 <time dateTime={article.isoDate} itemProp="datePublished">
                          {article.formattedDate}
                        </time>
                      </span>
                      
                      {/* وقت قراءة واقعي */}
                      <span>
                        ⏱️ <meta itemProp="timeRequired" content={`PT${article.readTime.split(' ')[0]}M`} />
                        {article.readTime}
                      </span>
                      
                      <span itemProp="url">اقرأ المزيد →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{padding: '60px', textAlign: 'center', background: 'var(--white)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)'}}>
              <h3 style={{fontSize: '1.5rem', color: 'var(--gray-600)', marginBottom: '15px'}}>📭 لا توجد مقالات بعد</h3>
              <p style={{color: 'var(--gray-500)', marginBottom: '30px'}}>تابعنا لوصول أحدث النصائح والمقالات!</p>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}