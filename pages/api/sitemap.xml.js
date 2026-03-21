import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const servicesPath = path.join(process.cwd(), 'data', 'services.json');
  const articlesPath = path.join(process.cwd(), 'data', 'articles.json');
  
  const services = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));
  const articles = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));

  const baseUrl = 'https://noorclean.com';
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.0</priority>
    <changefreq>daily</changefreq>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>
  <url>
    <loc>${baseUrl}/articles</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.8</priority>
    <changefreq>weekly</changefreq>
  </url>
`;

  services.filter(s => s.active).forEach(service => {
    sitemap += `  <url>
    <loc>${baseUrl}/services/${service.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.9</priority>
    <changefreq>weekly</changefreq>
  </url>
`;
  });

  articles.filter(a => a.active).forEach(article => {
    sitemap += `  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <lastmod>${article.updatedAt || article.publishedAt}</lastmod>
    <priority>0.7</priority>
    <changefreq>monthly</changefreq>
  </url>
`;
  });

  sitemap += `</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(sitemap);
}