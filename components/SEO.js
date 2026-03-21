import Head from 'next/head';

export default function SEO({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  article = null 
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noorclean.com';
  const defaultImage = '/og-image.jpg';
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={url || baseUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url || baseUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || `${baseUrl}${defaultImage}`} />
      <meta property="og:locale" content="ar_SA" />
      <meta property="og:site_name" content="نور كلين" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url || baseUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || `${baseUrl}${defaultImage}`} />
      
      {/* Article Specific (if blog post) */}
      {article && (
        <>
          <meta property="article:published_time" content={article.publishedAt} />
          <meta property="article:modified_time" content={article.updatedAt || article.publishedAt} />
          <meta property="article:author" content={article.author} />
          <meta property="article:section" content={article.category} />
          {article.tags?.map((tag, i) => (
            <meta key={i} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Structured Data - LocalBusiness */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "نور كلين",
          "image": `${baseUrl}/logo.png`,
          "@id": baseUrl,
          "url": baseUrl,
          "telephone": "966500000000",
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
            "https://wa.me/966500000000"
          ]
        })}
      </script>
      
      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "الرئيسية",
              "item": baseUrl
            },
            ...(url && url !== baseUrl ? [{
              "@type": "ListItem",
              "position": 2,
              "name": title,
              "item": url
            }] : [])
          ]
        })}
      </script>
    </Head>
  );
}