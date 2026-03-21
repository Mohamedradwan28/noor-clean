import fs from 'fs';
import path from 'path';

export default function RSS() {
  return null;
}

export async function getServerSideProps({ res }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noorclean.com';
  const articlesPath = path.join(process.cwd(), 'data', 'articles.json');
  
  let articles = [];
  try {
    articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8')).filter(a => a.active);
  } catch (e) {
    console.error('Error reading articles:', e);
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>نور كلين - مقالات ونصائح</title>
    <link>${baseUrl}</link>
    <description>أحدث المقالات والنصائح في مجال التنظيف ومكافحة الحشرات</description>
    <language>ar-SA</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    
    ${articles.map(article => `
    <item>
      <title>${article.title}</title>
      <link>${baseUrl}/articles/${article.slug}</link>
      <description>${article.excerpt}</description>
      <pubDate>${new Date(article.publishedAt || Date.now()).toUTCString()}</pubDate>
      <guid>${baseUrl}/articles/${article.slug}</guid>
      <category>${article.category || 'عام'}</category>
    </item>`).join('')}
    
  </channel>
</rss>`;

  res.setHeader('Content-Type', 'application/xml');
  res.write(rss);
  res.end();

  return { props: {} };
}