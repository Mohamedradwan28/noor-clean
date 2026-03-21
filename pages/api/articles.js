import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'articles.json');

function readArticles() {
  try {
    if (!fs.existsSync(dataPath)) return [];
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading articles:', error);
    return [];
  }
}

function writeArticles(articles) {
  fs.writeFileSync(dataPath, JSON.stringify(articles, null, 2), 'utf8');
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    const articles = readArticles();
    const isAdmin = req.query.admin === 'true';
    if (req.query.slug) {
      const index = articles.findIndex(a => a.slug === req.query.slug);
      if (index !== -1) {
        articles[index].views = (articles[index].views || 0) + 1;
        writeArticles(articles);
      }
    }
    return res.status(200).json(isAdmin ? articles : articles.filter(a => a.active === true));
  }
  if (req.method === 'POST') {
    const articles = readArticles();
    const newArticle = { id: Date.now(), ...req.body, seo: req.body.seo || {}, active: req.body.active !== undefined ? req.body.active : true, views: 0, publishedAt: new Date().toISOString().split('T')[0] };
    articles.push(newArticle);
    writeArticles(articles);
    return res.status(201).json(newArticle);
  }
  if (req.method === 'PUT') {
    const articles = readArticles();
    const index = articles.findIndex(a => a.id == req.body.id);
    if (index !== -1) {
      articles[index] = { ...articles[index], ...req.body };
      writeArticles(articles);
      return res.status(200).json(articles[index]);
    }
    return res.status(404).json({ error: 'Article not found' });
  }
  if (req.method === 'DELETE') {
    const articles = readArticles();
    const filtered = articles.filter(a => a.id != req.body.id);
    writeArticles(filtered);
    return res.status(200).json({ success: true });
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}