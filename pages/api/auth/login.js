import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { password } = req.body;
  const settingsPath = path.join(process.cwd(), 'data', 'settings.json');
  if (!fs.existsSync(settingsPath)) return res.status(500).json({ success: false, error: 'Settings file not found' });
  const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  if (password === settings.adminPassword) {
    return res.status(200).json({ success: true, message: 'تم تسجيل الدخول بنجاح', expiresIn: 24 * 60 * 60 * 1000 });
  }
  return res.status(401).json({ success: false, error: 'كلمة المرور غير صحيحة' });
}