import fs from 'fs';
import path from 'path';

export default function Sitemap() {
  return null;
}

export async function getServerSideProps({ res }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noorclean.com';
  
  // Read services and articles
  const servicesPath = path.join(process.cwd(), 'data', 'services.json');
  const articlesPath = path.join(process.cwd(), 'data', 'articles.json');
  
  let services = [], articles = [];
  
  try {
    services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));
    articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
  } catch (e) {
    console.error('Error reading data files:', e);
  }

  const today = new Date().toISOString();

  // Build sitemap XML
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
  <!-- الرئيسية -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- صفحة اتصل بنا -->
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- صفحة المقالات -->
  <url>
    <loc>${baseUrl}/articles</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;

  // Add services
  services.filter(s => s.active).forEach(service => {
    sitemap += `
  <!-- خدمة: ${service.title} -->
  <url>
    <loc>${baseUrl}/services/${service.slug}</loc>
    <lastmod>${service.updatedAt || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  });

  // Add articles
  articles.filter(a => a.active).forEach(article => {
    sitemap += `
  <!-- مقال: ${article.title} -->
  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <lastmod>${article.updatedAt || article.publishedAt || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
}