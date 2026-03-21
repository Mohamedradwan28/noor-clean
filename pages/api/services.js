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
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const result = req.query.slug ? [data] : data;
      return res.status(200).json(result || []);
    }

    // ===== POST: إضافة خدمة جديدة =====
    if (method === 'POST') {
      const { 
        title, 
        slug, 
        description, 
        short_description, 
        category, 
        image, 
        icon, 
        features, 
        content, 
        price,
        active 
      } = req.body;

      // تحقق من الحقول المطلوبة
      if (!title || !slug) {
        return res.status(400).json({ 
          error: 'العنوان و Slug مطلوبين' 
        });
      }

      const { data, error } = await supabase
        .from('services')
        .insert([{
          title,
          slug,
          description: description || '',
          short_description: short_description || '',
          category: category || '',
          image: image || '',
          icon: icon || '',
          features: features || [],
          content: content || '',
          price: price || '',
          active: active !== undefined ? active : true
        }])
        .select()
        .single();

      if (error) {
        console.error('Supabase Insert Error:', error);
        return res.status(500).json({ 
          error: error.message,
          details: error 
        });
      }

      return res.status(201).json({ 
        success: true, 
        data 
      });
    }

    // ===== PUT: تحديث خدمة =====
    if (method === 'PUT') {
      const { id, ...updateData } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'ID مطلوب' });
      }

      const { data, error } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase Update Error:', error);
        return res.status(500).json({ 
          error: error.message,
          details: error 
        });
      }

      return res.status(200).json({ success: true, data });
    }

    // ===== DELETE: حذف خدمة =====
    if (method === 'DELETE') {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: 'ID مطلوب' });
      }

      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase Delete Error:', error);
        return res.status(500).json({ 
          error: error.message,
          details: error 
        });
      }

      return res.status(200).json({ success: true });
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}