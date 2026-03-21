// pages/api/services.js
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  const { method } = req;

  try {
    // ===== GET: جلب الخدمات =====
    if (method === 'GET') {
      let query = supabase.from('services').select('*');
      
      if (req.query.slug) {
        query = query.eq('slug', req.query.slug).single();
      } else if (req.query.category) {
        query = query.eq('category', req.query.category);
      } else if (!req.query.admin) {
        query = query.eq('active', true);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      
      const result = req.query.slug ? [data] : data;
      return res.status(200).json(result || []);
    }

    // ===== POST: إضافة خدمة جديدة =====
    if (method === 'POST') {
      const {
        title, slug, short_description, description, content, price, image, icon,
        category, features, active, featured, order
      } = req.body;

      if (!title || !slug) {
        return res.status(400).json({ error: 'العنوان و Slug مطلوبين' });
      }

      const { data, error } = await supabase
        .from('services')
        .insert([{
          title, slug, short_description, description, content, price, image, icon,
          category, features, active, featured, order
        }])
        .select()
        .single();

      if (error) {
        console.error('Insert Error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({ success: true, data });
    }

    // ===== PUT: تحديث خدمة =====
    if (method === 'PUT') {
      const { id, ...updateData } = req.body;
      if (!id) return res.status(400).json({ error: 'ID مطلوب' });

      const { data, error } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', Number(id))
        .select()
        .single();

      if (error) {
        console.error('Update Error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true, data });
    }

    // ===== DELETE: حذف خدمة =====
    if (method === 'DELETE') {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'ID مطلوب' });

      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', Number(id));

      if (error) {
        console.error('Delete Error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Services API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}