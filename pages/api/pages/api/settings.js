import fs from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'data', 'settings.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    if (!fs.existsSync(settingsPath)) return res.status(404).json({ error: 'Settings not found' });
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    delete settings.adminPassword;
    return res.status(200).json(settings);
  }
  if (req.method === 'PUT') {
    const currentSettings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    const newSettings = { ...currentSettings, ...req.body };
    fs.writeFileSync(settingsPath, JSON.stringify(newSettings, null, 2), 'utf8');
    return res.status(200).json(newSettings);
  }
  return res.status(405).json({ error: 'Method not allowed' });
}