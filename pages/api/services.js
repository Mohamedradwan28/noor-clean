import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'services.json');

function readServices() {
  try {
    if (!fs.existsSync(dataPath)) return [];
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading services:', error);
    return [];
  }
}

function writeServices(services) {
  fs.writeFileSync(dataPath, JSON.stringify(services, null, 2), 'utf8');
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    const services = readServices();
    const isAdmin = req.query.admin === 'true';
    return res.status(200).json(isAdmin ? services : services.filter(s => s.active === true));
  }
  if (req.method === 'POST') {
    const services = readServices();
    const newService = { id: Date.now(), ...req.body, seo: req.body.seo || {}, active: req.body.active !== undefined ? req.body.active : true, featured: req.body.featured || false, order: req.body.order || services.length + 1 };
    services.push(newService);
    writeServices(services);
    return res.status(201).json(newService);
  }
  if (req.method === 'PUT') {
    const services = readServices();
    const index = services.findIndex(s => s.id == req.body.id);
    if (index !== -1) {
      services[index] = { ...services[index], ...req.body };
      writeServices(services);
      return res.status(200).json(services[index]);
    }
    return res.status(404).json({ error: 'Service not found' });
  }
  if (req.method === 'DELETE') {
    const services = readServices();
    const filtered = services.filter(s => s.id != req.body.id);
    writeServices(filtered);
    return res.status(200).json({ success: true });
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}