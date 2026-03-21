// pages/api/settings.js
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (!['GET', 'PUT', 'POST'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // ===== GET: جلب الإعدادات =====
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('settings')
        .select('*');
      
      if (error) throw error;
      
      const settings = {};
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (item?.key && item?.value !== undefined) {
            settings[item.key.trim()] = item.value;
          }
        });
      }
      
      res.setHeader('Cache-Control', 'no-store, max-age=0');
      return res.status(200).json(settings);
    }

    // ===== PUT/POST: تحديث أو إضافة باستخدام UPSERT =====
    if (req.method === 'PUT' || req.method === 'POST') {
      const { key, value } = req.body;
      
      if (!key || key.trim() === '') {
        return res.status(400).json({ error: 'مفتاح الإعداد (key) مطلوب' });
      }
      
      const cleanKey = key.trim();
      const cleanValue = value !== undefined ? String(value).trim() : '';
      
      // ✅ استخدم upsert: يحدث لو موجود، يضيف لو مش موجود
      const { data, error } = await supabase
        .from('settings')
        .upsert(
          { 
            key: cleanKey, 
            value: cleanValue,
            updated_at: new Date().toISOString()
          },
          { 
            onConflict: 'key',  // ✅ لو الـ key مكرر، حدّثه مش ارمي خطأ
            ignoreDuplicates: false 
          }
        )
        .select()
        .single();
      
      if (error) {
        console.error('Supabase upsert error:', error);
        return res.status(500).json({ error: error.message });
      }
      
      return res.status(200).json(data);
    }

  } catch (error) {
    console.error('Settings API Error:', error);
    return res.status(500).json({ 
      error: error.message,
      message: 'حدث خطأ في الخادم'
    });
  }
}