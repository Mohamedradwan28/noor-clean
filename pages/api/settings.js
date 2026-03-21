// pages/api/settings.js
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (!['GET', 'POST', 'PUT'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // ===== GET: جلب الإعدادات =====
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('settings')
        .select('*');
      
      if (error) throw error;
      
      // تحويل المصفوفة إلى كائن
      const settings = {};
      data.forEach(item => {
        settings[item.key] = item.value;
      });
      
      return res.status(200).json(settings);
    }

    // ===== POST/PUT: حفظ أو تحديث إعداد =====
    if (req.method === 'POST' || req.method === 'PUT') {
      const { key, value } = req.body;
      
      if (!key) {
        return res.status(400).json({ error: 'Key is required' });
      }
      
      // تحقق إذا كان المفتاح موجود
      const { data: existing } = await supabase
        .from('settings')
        .select('*')
        .eq('key', key)
        .single();
      
      let result, error;
      
      if (existing) {
        // تحديث
        ({ data: result, error } = await supabase
          .from('settings')
          .update({ 
            value, 
            updated_at: new Date().toISOString() 
          })
          .eq('key', key)
          .select()
          .single());
      } else {
        // إضافة جديد
        ({ data: result, error } = await supabase
          .from('settings')
          .insert([{ 
            key, 
            value,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single());
      }
      
      if (error) throw error;
      return res.status(200).json(result);
    }

  } catch (error) {
    console.error('Settings API Error:', error);
    return res.status(500).json({ 
      error: error.message,
      message: 'حدث خطأ في الخادم'
    });
  }
}