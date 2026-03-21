import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // التحقق من أن الطلب من المصدر الصحيح
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ 
      error: 'Missing Supabase credentials',
      message: 'تأكد من إضافة متغيرات البيئة في .env.local و Vercel'
    });
  }

  // استخدام Service Role Key لإنشاء الجداول (صلاحيات أعلى)
  const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseKey);

  try {
    // ===== إنشاء جدول الخدمات =====
    const { error: servicesError } = await supabase.rpc('create_services_table');
    
    // ===== إنشاء جدول المقالات =====
    const { error: articlesError } = await supabase.rpc('create_articles_table');
    
    // ===== إنشاء جدول الإعدادات =====
    const { error: settingsError } = await supabase.rpc('create_settings_table');

    // ===== إضافة بيانات أولية =====
    const initialServices = [
      {
        title: 'مكافحة حشرات بالرياض',
        slug: 'pest-control-riyadh',
        description: 'خدمة مكافحة حشرات شاملة باستخدام أحدث المبيدات الآمنة',
        short_description: 'قضاء تام على جميع أنواع الحشرات',
        category: 'مكافحة حشرات',
        image: 'https://images.unsplash.com/photo-1628149455676-123a33f54e99?w=800',
        icon: '🐜',
        features: ['ضمان 6 أشهر', 'مبيدات آمنة', 'فريق محترف'],
        content: '# مكافحة حشرات شاملة\n\nنقدم خدمة متكاملة لمكافحة جميع أنواع الحشرات...',
        active: true,
        price: 'يبدأ من 300 ريال'
      },
      {
        title: 'تنظيف فلل وشقق',
        slug: 'villa-cleaning',
        description: 'تنظيف شامل للفلل والشقق بأعلى معايير الجودة',
        short_description: 'نظافة لماعة لكل زاوية في منزلك',
        category: 'تنظيف',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
        icon: '🧹',
        features: ['فريق نسائي', 'مواد معتمدة', 'سرعة في الإنجاز'],
        content: '# تنظيف فلل وشقق\n\nنقدم خدمة تنظيف متكاملة...',
        active: true,
        price: 'يبدأ من 500 ريال'
      },
      {
        title: 'غسيل كنب ومجالس',
        slug: 'sofa-cleaning',
        description: 'غسيل وتعقيم الكنب والمجالس بأحدث الأجهزة',
        short_description: 'إرجاع اللمعان الأصلي لكانبك',
        category: 'تنظيف',
        image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800',
        icon: '🛋️',
        features: ['غسيل بالبخار', 'تعقيم عميق', 'تجفيف سريع'],
        content: '# غسيل كنب ومجالس\n\nنستخدم أحدث أجهزة الغسيل بالبخار...',
        active: true,
        price: 'يبدأ من 250 ريال'
      }
    ];

    const initialArticles = [
      {
        title: 'أفضل طرق مكافحة الحشرات في الرياض 2026',
        slug: 'best-pest-control-riyadh',
        excerpt: 'دليل شامل لأفضل طرق مكافحة الحشرات في الرياض مع نصائح من الخبراء',
        content: '# مقدمة\n\nتعتبر مكافحة الحشرات من أهم الخدمات المطلوبة في الرياض...\n\n## أنواع الحشرات الشائعة\n\n### النمل الأبيض\nيُعد من أخطر الحشرات...\n\n### الصراصير\nتنتشر في المطابخ...',
        category: 'مكافحة حشرات',
        image: 'https://images.unsplash.com/photo-1628149455676-123a33f54e99?w=800',
        author: 'فريق نور كلين',
        tags: ['مكافحة حشرات', 'الرياض', 'نصائح', '2026'],
        published_at: new Date().toISOString(),
        active: true
      },
      {
        title: '10 نصائح لتنظيف الفلل بسرعة واحترافية',
        slug: 'villa-cleaning-tips',
        excerpt: 'تعلم أسرار تنظيف الفلل من خبراء نور كلين في 10 خطوات عملية',
        content: '# 10 نصائح لتنظيف الفلل\n\nتنظيف الفلل يحتاج إلى خطة منظمة...\n\n## الخطوة 1: التخطيط المسبق\n\nقبل البدء في التنظيف...\n\n## الخطوة 2: البدء من الأعلى\n\nدائماً ابدأ بتنظيف الأسقف...',
        category: 'تنظيف',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800',
        author: 'فريق نور كلين',
        tags: ['تنظيف', 'فلل', 'نصائح', 'منزل'],
        published_at: new Date().toISOString(),
        active: true
      }
    ];

    const initialSettings = [
      { key: 'siteName', value: 'نور كلين' },
      { key: 'tagline', value: 'شريكك للنظافة في الرياض' },
      { key: 'phone', value: '966500000000' },
      { key: 'whatsapp', value: '966500000000' },
      { key: 'email', value: 'info@noorclean.com' },
      { key: 'address', value: 'الرياض، المملكة العربية السعودية' },
      { key: 'workingHours', value: 'السبت-الخميس 8:00 صباحاً - 10:00 مساءً' },
      { key: 'seo_defaultDescription', value: 'أفضل خدمات التنظيف ومكافحة الحشرات في الرياض' },
      { key: 'seo_defaultKeywords', value: 'تنظيف، مكافحة حشرات، الرياض، نور كلين' },
      { key: 'seo_canonical', value: 'https://noorclean.com' }
    ];

    // إدخال البيانات الأولية
    for (const service of initialServices) {
      await supabase.from('services').upsert(service);
    }

    for (const article of initialArticles) {
      await supabase.from('articles').upsert(article);
    }

    for (const setting of initialSettings) {
      await supabase.from('settings').upsert(setting);
    }

    return res.status(200).json({
      success: true,
      message: '✅ تم إعداد قاعدة البيانات بنجاح!',
      tables: ['services', 'articles', 'settings'],
      servicesCount: initialServices.length,
      articlesCount: initialArticles.length,
      settingsCount: initialSettings.length
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'حدث خطأ أثناء الإعداد'
    });
  }
}