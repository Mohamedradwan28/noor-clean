// pages/api/articles.js
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  const { method } = req;

  try {
    // ===== GET: جلب المقالات =====
    if (method === 'GET') {
      let query = supabase.from('articles').select('*');
      
      if (req.query.slug) {
        query = query.eq('slug', req.query.slug).single();
      } else if (req.query.category) {
        query = query.eq('category', req.query.category);
      } else if (!req.query.admin) {
        query = query.eq('active', true);
      }
      
      query = query.order('published_at', { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      
      const result = req.query.slug ? [data] : data;
      return res.status(200).json(result || []);
    }

    // ===== POST: إضافة مقال =====
    if (method === 'POST') {
      // ✅ نأخذ فقط الحقول الموجودة فعلياً في جدول articles
      const {
        title,
        slug,
        excerpt,
        content,
        category,
        image,
        author,
        tags,
        published_at,
        active
      } = req.body;

      if (!title || !slug) {
        return res.status(400).json({ error: 'العنوان و Slug مطلوبين' });
      }

      // ✅ نبني объект نظيف بدون حقول محسوبة
      const articleData = {
        title,
        slug,
        excerpt: excerpt || '',
        content: content || '',
        category: category || '',
        image: image || '',
        author: author || 'نور كلين',
        tags: Array.isArray(tags) ? tags : [],
        published_at: published_at || new Date().toISOString(),
        active: active !== undefined ? active : true
      };

      const { data, error } = await supabase
        .from('articles')
        .insert([articleData])
        .select()
        .single();

      if (error) {
        console.error('Insert Error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({ success: true, data });
    }

    // ===== PUT: تحديث مقال =====
    if (method === 'PUT') {
      const { id, ...updateData } = req.body;
      if (!id) return res.status(400).json({ error: 'ID مطلوب' });

      // ✅ نزيل أي حقول مش في الجدول
      const { readTime, formattedDate, isoDate, excerpt, ...cleanData } = updateData;

      const { data, error } = await supabase
        .from('articles')
        .update(cleanData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Update Error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ success: true, data });
    }

    // ===== DELETE: حذف مقال =====
    if (method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID مطلوب' });

      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) return res.status(500).json({ error: error.message });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}