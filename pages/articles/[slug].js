import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Link from 'next/link';

// ===== دالة آمنة للتعامل مع tags (نص أو مصفوفة) =====
function getTagsArray(tags) {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    return tags.split(',').map(t => t.trim()).filter(t => t);
  }
  return [];
}

// ===== دالة تنسيق التاريخ بالعربية =====
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function ArticlePage() {
  const router = useRouter();
  const { slug } = router.query;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    if (slug) {
      Promise.all([
        fetch(`/api/articles?slug=${slug}`).then(res => res.json()),
        fetch('/api/settings').then(res => res.json())
      ]).then(([articlesData, settingsData]) => {
        const found = articlesData.find(a => a.slug === slug);
        if (found) {
          // معالجة المقال: تحويل tags، تنسيق التاريخ (بدون وقت قراءة)
          const processedArticle = {
            ...found,
            tagsArray: getTagsArray(found.tags),
            formattedDate: formatDate(found.publishedAt),
            isoDate: found.publishedAt ? new Date(found.publishedAt).toISOString() : new Date().toISOString()
          };
          setArticle(processedArticle);
        }
        setSettings(settingsData);
        setLoading(false);
      });
    }
  }, [slug]);

  // ===== إعدادات الـ SEO الديناميكية =====
  const baseUrl = settings.seo?.canonical || 'https://noorclean.com';
  const articleUrl = article ? `${baseUrl}/articles/${article.slug}` : baseUrl;
  const articleTitle = article?.seo?.metaTitle || `${article?.title || 'مقال'} | مدونة ${settings.siteName || 'نور كلين'}`;
  const articleDescription = article?.seo?.metaDescription || article?.excerpt || article?.content?.substring(0, 160) + '...';
  
  // كلمات مفتاحية آمنة
  const tagsString = article?.tagsArray?.length > 0 ? article.tagsArray.join(', ') : '';
  const articleKeywords = article?.seo?.keywords || `${article?.title || ''}, ${article?.category || ''}, ${tagsString}, الرياض, نور كلين`.trim().replace(/,\s*,/g, ',');
  
  const articleImage = article?.image || `${baseUrl}/og-image.jpg`;
  const publishedDate = article?.isoDate || new Date().toISOString();
  const modifiedDate = article?.updatedAt ? new Date(article.updatedAt).toISOString() : publishedDate;

  // ===== Structured Data: BlogPosting Schema =====
  const articleSchema = article ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": articleUrl,
    "mainEntityOfPage": { "@type": "WebPage", "@id": articleUrl },
    "headline": article.title,
    "description": article.excerpt,
    "image": { "@type": "ImageObject", "url": articleImage, "width": 1200, "height": 630 },
    "datePublished": publishedDate,
    "dateModified": modifiedDate,
    "author": { "@type": "Person", "name": article.author || 'فريق نور كلين', "url": baseUrl },
    "publisher": {
      "@type": "Organization",
      "name": settings.siteName || 'نور كلين',
      "logo": { "@type": "ImageObject", "url": `${baseUrl}/logo.png`, "width": 600, "height": 60 }
    },
    "articleBody": article.content,
    "articleSection": article.category || 'عام',
    "keywords": article.tagsArray?.join(', ') || articleKeywords,
    "inLanguage": "ar-SA",
    "isAccessibleForFree": true
  } : null;

  // ===== Structured Data: Breadcrumb Schema =====
  const breadcrumbSchema = article ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "المقالات", "item": `${baseUrl}/articles` },
      { "@type": "ListItem", "position": 3, "name": article.title, "item": articleUrl }
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
  if (!article) {
    return (
      <Layout>
        <Head>
          <title>المقال غير موجود | {settings.siteName || 'نور كلين'}</title>
          <meta name="robots" content="noindex" />
        </Head>
        <div className="container" style={{textAlign: 'center', padding: '100px 20px'}}>
          <h1 style={{fontSize: '2rem', color: 'var(--gray-600)', marginBottom: '20px'}}>😕 المقال غير موجود</h1>
          <Link href="/articles" className="btn btn-primary">العودة للمقالات</Link>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        {/* ===== Basic Meta Tags ===== */}
        <title>{articleTitle}</title>
        <meta name="description" content={articleDescription} />
        <meta name="keywords" content={articleKeywords} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href={articleUrl} />
        <meta name="author" content={article.author || 'فريق نور كلين'} />
        <meta name="publisher" content={settings.siteName || 'نور كلين'} />
        <meta name="article:published_time" content={publishedDate} />
        <meta name="article:modified_time" content={modifiedDate} />
        
        {/* ===== Language & Region ===== */}
        <meta httpEquiv="content-language" content="ar-SA" />
        <meta name="geo.region" content="SA-01" />
        <meta name="geo.placename" content="الرياض" />
        
        {/* ===== Open Graph / Facebook ===== */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:title" content={articleTitle} />
        <meta property="og:description" content={articleDescription} />
        <meta property="og:image" content={articleImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={article.title} />
        <meta property="og:locale" content="ar_SA" />
        <meta property="og:site_name" content={settings.siteName || 'نور كلين'} />
        <meta property="article:section" content={article.category} />
        <meta property="article:published_time" content={publishedDate} />
        <meta property="article:modified_time" content={modifiedDate} />
        <meta property="article:author" content={article.author || 'فريق نور كلين'} />
        {article.tagsArray?.map((tag, i) => (
          <meta key={i} property="article:tag" content={tag} />
        ))}
        
        {/* ===== Twitter Card ===== */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={articleUrl} />
        <meta name="twitter:title" content={articleTitle} />
        <meta name="twitter:description" content={articleDescription} />
        <meta name="twitter:image" content={articleImage} />
        <meta name="twitter:creator" content="@noorclean" />
        
        {/* ===== Preload Critical Resources ===== */}
        <link rel="preload" href={articleImage} as="image" />
        
        {/* ===== Structured Data - JSON-LD ===== */}
        {articleSchema && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        )}
        {breadcrumbSchema && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        )}
      </Head>

      <Layout title={articleTitle}>
        <div className="container service-page">
          <article className="service-article" itemScope itemType="https://schema.org/BlogPosting">
            {/* Schema Microdata */}
            <meta itemProp="headline" content={article.title} />
            <meta itemProp="description" content={article.excerpt} />
            <meta itemProp="datePublished" content={publishedDate} />
            <meta itemProp="dateModified" content={modifiedDate} />
            <meta itemProp="articleSection" content={article.category} />
            <meta itemProp="inLanguage" content="ar-SA" />
            <meta itemProp="isAccessibleForFree" content="True" />
            
            {/* Category */}
            <span className="article-cell-category" itemProp="articleSection">{article.category}</span>
            
            {/* Title */}
            <h1 itemProp="headline">{article.title}</h1>
            
            {/* Author & Date - بدون وقت القراءة */}
            <div style={{display: 'flex', gap: '20px', marginBottom: '30px', color: 'var(--gray-500)', fontSize: '0.95rem'}} itemProp="author" itemScope itemType="https://schema.org/Person">
              <span>✍️ <span itemProp="name">{article.author || 'فريق نور كلين'}</span></span>
              <meta itemProp="url" content={baseUrl} />
              <span>📅 <time itemProp="datePublished" dateTime={publishedDate}>{article.formattedDate}</time></span>
            </div>
            
            {/* Featured Image */}
            <img 
              src={article.image} 
              alt={article.seo?.ogTitle || article.title} 
              className="service-article-image"
              itemProp="image"
              width="1200"
              height="630"
              loading="eager"
            />
            <meta itemProp="thumbnailUrl" content={article.image} />
            
            {/* Article Content */}
            <div className="service-article-content" itemProp="articleBody">
              {article.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('#')) {
                  return <h2 key={index} itemProp="about">{paragraph.replace('#', '')}</h2>;
                }
                if (paragraph.startsWith('##')) {
                  return <h3 key={index}>{paragraph.replace('##', '')}</h3>;
                }
                return paragraph ? <p key={index}>{paragraph}</p> : null;
              })}
            </div>
            
            {/* Tags - Safe Handling */}
            {article.tagsArray && article.tagsArray.length > 0 && (
              <div style={{marginTop: '40px', paddingTop: '30px', borderTop: '1px solid var(--gray-200)'}}>
                <h4 style={{marginBottom: '15px', color: 'var(--gray-600)'}}>🏷️ الكلمات الدلالية:</h4>
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}} itemProp="keywords">
                  {article.tagsArray.map((tag, i) => (
                    <Link 
                      key={i} 
                      href={`/articles?tag=${encodeURIComponent(tag)}`}
                      style={{background: 'var(--gray-100)', color: 'var(--gray-700)', padding: '8px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none'}}
                      itemProp="about"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Related Articles Section */}
            <div style={{marginTop: '60px', paddingTop: '40px', borderTop: '2px solid var(--gray-200)'}}>
              <h3 style={{marginBottom: '20px', color: 'var(--secondary)'}}>📚 مقالات قد تهمك أيضاً</h3>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '15px'}}>
                <Link href="/articles" style={{color: 'var(--primary)', fontWeight: '600', textDecoration: 'none'}}>
                  ← عرض جميع المقالات
                </Link>
              </div>
            </div>
            
            {/* Call to Action */}
            <div style={{textAlign: 'center', marginTop: '50px'}}>
              <Link href="/contact" className="btn btn-primary btn-lg" itemProp="potentialAction" itemScope itemType="https://schema.org/ReserveAction">
                <meta itemProp="target" content={`${baseUrl}/contact`} />
                📞 احجز خدمتك الآن
              </Link>
              <Link href="/articles" className="btn btn-lg" style={{background: 'var(--gray-200)', color: 'var(--gray-700)', marginRight: '15px'}}>
                ← العودة للمقالات
              </Link>
            </div>
          </article>
        </div>
      </Layout>
    </>
  );
}