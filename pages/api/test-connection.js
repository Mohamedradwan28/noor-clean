// pages/api/test-connection.js
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  const result = {
    status: '❌ Failed',
    message: '',
    details: {}
  };

  try {
    // 1. اختبار الاتصال الأساسي
    const { data: ping, error: pingError } = await supabase
      .from('services')
      .select('id')
      .limit(1);

    if (pingError) {
      result.status = '❌ Failed';
      result.message = 'فشل الاتصال بـ Supabase';
      result.details.error = pingError.message;
      return res.status(500).json(result);
    }

    // 2. اختبار جلب البيانات
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('id, title, active')
      .eq('active', true);

    if (servicesError) {
      result.status = '⚠️ Partial';
      result.message = 'الاتصال شغال لكن فيه مشكلة في البيانات';
      result.details.error = servicesError.message;
    } else {
      result.status = '✅ Success';
      result.message = 'الاتصال بـ Supabase شغال 100%!';
      result.details.servicesCount = services?.length || 0;
      result.details.services = services;
    }

    // 3. اختبار الإعدادات
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('key, value');

    if (!settingsError) {
      const settingsObj = {};
      settings?.forEach(s => { settingsObj[s.key] = s.value; });
      result.details.settings = settingsObj;
    }

    return res.status(200).json(result);

  } catch (error) {
    result.status = '❌ Failed';
    result.message = error.message;
    return res.status(500).json(result);
  }
}