// pages/api/services.js
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  // السماح فقط للـ GET و POST و PUT و DELETE
  if (!['GET', 'POST', 'PUT', 'DELETE'].includes(req.method)) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // ===== GET: جلب الخدمات =====
    if (req.method === 'GET') {
      let query = supabase.from('services').select('*');
      
      // فلترة حسب slug لو موجود
      if (req.query.slug) {
        query = query.eq('slug', req.query.slug).single();
      } else {
        query = query.eq('active', true).order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return res.status(200).json(data);
    }

    // ===== POST: إضافة خدمة جديدة =====
    if (req.method === 'POST') {
      const { data, error } = await supabase
        .from('services')
        .insert([req.body])
        .select()
        .single();
      
      if (error) throw error;
      return res.status(201).json(data);
    }

    // ===== PUT: تحديث خدمة =====
    if (req.method === 'PUT') {
      const { id, ...updateData } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }
      
      const { data, error } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return res.status(200).json(data);
    }

    // ===== DELETE: حذف خدمة =====
    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }
      
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

  } catch (error) {
    console.error('Services API Error:', error);
    return res.status(500).json({ 
      error: error.message,
      message: 'حدث خطأ في الخادم'
    });
  }
}