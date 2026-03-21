import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Head from 'next/head';

export default function Dashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [services, setServices] = useState([]);
  const [articles, setArticles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState({});
  const [settingsForm, setSettingsForm] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [successMsg, setSuccessMsg] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // نموذج الخدمات
  const [serviceForm, setServiceForm] = useState({
    slug: '', title: '', shortDescription: '', description: '', content: '', price: '', image: '', icon: '🧹',
    category: '', features: [],
    seo: { metaTitle: '', metaDescription: '', keywords: '' },
    active: true, featured: false, order: 0
  });
  const [editingServiceId, setEditingServiceId] = useState(null);
  
  // نموذج المقالات
  const [articleForm, setArticleForm] = useState({
    slug: '', title: '', excerpt: '', content: '', image: '', category: '', tags: '', author: 'فريق نور كلين',
    seo: { metaTitle: '', metaDescription: '', keywords: '' },
    active: true, readTime: '5 دقائق'
  });
  const [editingArticleId, setEditingArticleId] = useState(null);

  // ===== التحقق من تسجيل الدخول =====
  useEffect(() => {
    const admin = localStorage.getItem('isAdmin');
    const loginTime = localStorage.getItem('adminLoginTime');
    
    if (!admin || (loginTime && Date.now() - parseInt(loginTime) > 24 * 60 * 60 * 1000)) {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminLoginTime');
      router.push('/admin/login');
      return;
    }
    setIsAuthenticated(true);
    fetchAllData();
  }, []);

  // ===== مزامنة settingsForm مع settings =====
  useEffect(() => {
    if (Object.keys(settings).length > 0) {
      setSettingsForm(settings);
    }
  }, [settings]);

  // ===== جلب جميع البيانات =====
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [servicesRes, articlesRes, ordersRes, settingsRes] = await Promise.all([
        fetch('/api/services?admin=true'),
        fetch('/api/articles?admin=true'),
        fetch('/api/orders'),
        fetch(`/api/settings?t=${Date.now()}`)
      ]);
      
      if (servicesRes.ok) setServices(await servicesRes.json());
      if (articlesRes.ok) setArticles(await articlesRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings(data);
        setSettingsForm(data);
      }
    } catch (err) {
      console.error('Error fetching ', err);
    } finally {
      setLoading(false);
    }
  };

  // ===== تسجيل الخروج =====
  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminLoginTime');
    router.push('/admin/login');
  };

  // ===== ✅ إضافة خدمة من قالب جاهز =====
  const addServiceFromTemplate = (templateName) => {
    const templates = {
      'خزانات': {
        slug: 'water-tank-cleaning',
        title: 'تنظيف خزانات مياه',
        shortDescription: 'تنظيف وتعقيم خزانات المياه العلوية والأرضية بأعلى معايير السلامة',
        description: 'خدمة شاملة لتنظيف وتعقيم خزانات المياه',
        content: '# تنظيف خزانات مياه بالرياض\n\nنقدم خدمة متخصصة لتنظيف وتعقيم خزانات المياه باستخدام أحدث التقنيات والمواد المعتمدة من وزارة الصحة.',
        price: 'يبدأ من 400 ريال',
        image: 'https://images.unsplash.com/photo-1584621881563-1f37d31c6f1e?w=800',
        icon: '💧',
        category: 'تنظيف',
        features: ['تعقيم بمواد معتمدة', 'فريق مدرب', 'ضمان الرضا'],
        active: true
      },
      'نمل أبيض': {
        slug: 'termite-control',
        title: 'مكافحة النمل الأبيض',
        shortDescription: 'حماية منزلك من أخطر أنواع الحشرات بضمان طويل الأمد',
        description: 'خدمة متخصصة لمكافحة النمل الأبيض',
        content: '# مكافحة النمل الأبيض في الرياض\n\nالنمل الأبيض من أخطر الحشرات التي تهدد المباني. نقدم خدمة متكاملة للكشف والعلاج والوقاية.',
        price: 'يبدأ من 500 ريال',
        image: 'https://images.unsplash.com/photo-1628149455676-123a33f54e99?w=800',
        icon: '🐜',
        category: 'مكافحة حشرات',
        features: ['ضمان سنة', 'فحص مجاني', 'مواد آمنة'],
        active: true
      },
      'تكييف': {
        slug: 'ac-cleaning',
        title: 'تنظيف مكيفات مركزي',
        shortDescription: 'صيانة وتنظيف وحدات التكييف المركزية لتحسين الكفاءة',
        description: 'خدمة تنظيف وصيانة المكيفات المركزية',
        content: '# تنظيف مكيفات مركزي\n\nنقدم خدمة تنظيف شامل لوحدات التكييف المركزية لتحسين كفاءة التبريد وتوفير استهلاك الكهرباء.',
        price: 'يبدأ من 300 ريال/وحدة',
        image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800',
        icon: '❄️',
        category: 'صيانة',
        features: ['فحص فريون', 'تنظيف عميق', 'تحسين الكفاءة'],
        active: true
      },
      'سجاد': {
        slug: 'carpet-cleaning',
        title: 'غسيل سجاد وموكيت',
        shortDescription: 'غسيل عميق للسجاد والموكيت في الموقع بأحدث الأجهزة',
        description: 'خدمة غسيل السجاد والموكيت',
        content: '# غسيل سجاد وموكيت\n\nنستخدم أحدث أجهزة الغسيل بالبخار لإزالة البقع والجراثيم من سجاد منزلك.',
        price: 'يبدأ من 150 ريال/قطعة',
        image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800',
        icon: '🧶',
        category: 'تنظيف',
        features: ['غسيل بالبخار', 'تجفيف سريع', 'إزالة بقع صعبة'],
        active: true
      },
      'رخام': {
        slug: 'marble-polishing',
        title: 'تلميع رخام وأرضيات',
        shortDescription: 'تلميع وتكريستال للرخام والسيراميك لإرجاع اللمعان الأصلي',
        description: 'خدمة تلميع الرخام والأرضيات',
        content: '# تلميع رخام وأرضيات\n\nنقدم خدمة تلميع وتكريستال للرخام والسيراميك باستخدام أحدث المعدات الإيطالية.',
        price: 'يبدأ من 20 ريال/م²',
        image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
        icon: '✨',
        category: 'تنظيف',
        features: ['تكريستال إيطالي', 'حماية طويلة الأمد', 'لمعان فوري'],
        active: true
      },
      'حمام': {
        slug: 'pigeon-control',
        title: 'طرد الحمام والطيور',
        shortDescription: 'تركيب شبكات وأسلاك لمنع تعشيش الحمام بشكل آمن',
        description: 'خدمة طرد الحمام والطيور',
        content: '# طرد الحمام والطيور\n\nنقدم حلولاً آمنة وفعالة لمنع تعشيش الحمام على واجهات المباني والشرفات.',
        price: 'يبدأ من 350 ريال',
        image: 'https://images.unsplash.com/photo-1555169062-013468b47731?w=800',
        icon: '🕊️',
        category: 'مكافحة حشرات',
        features: ['شبكات ستانلس', 'ضمان 5 سنوات', 'تركيب احترافي'],
        active: true
      }
    };
    
    if (templates[templateName]) {
      setServiceForm({
        ...templates[templateName],
        shortDescription: templates[templateName].shortDescription || '',
        description: templates[templateName].description || '',
        seo: { metaTitle: '', metaDescription: '', keywords: '' }
      });
      setActiveTab('services');
      setSuccessMsg(`✅ تم تحميل قالب "${templateName}"، عدّل البيانات ثم اضغط إضافة`);
      setTimeout(() => setSuccessMsg(''), 4000);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSettingsSubmit = async (e) => {
  e.preventDefault();
  setSavingSettings(true);
  
  try {
    // ✅ فلتر الإعدادات الصالحة فقط
    const settingsToUpdate = Object.entries(settingsForm).filter(
      ([key, value]) => 
        value !== undefined && 
        value !== null && 
        !['loading', 'error', 'isAdmin', 'savingSettings'].includes(key)
    );
    
    // ✅ حدّث كل إعداد باستخدام الـ API المصحح (upsert)
    for (const [key, value] of settingsToUpdate) {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          key: key.trim(), 
          value: String(value).trim() 
        })
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || `فشل تحديث ${key}`);
      }
    }
    
    setSuccessMsg('✅ تم حفظ إعدادات الموقع بنجاح');
    
    // ✅ أعد جلب الإعدادات المحدثة فوراً
    const freshRes = await fetch(`/api/settings?t=${Date.now()}`);
    const freshData = await freshRes.json();
    setSettings(freshData);
    setSettingsForm(freshData);
    
  } catch (err) {
    console.error('Error saving settings:', err);
    setSuccessMsg('❌ خطأ: ' + err.message);
  } finally {
    setSavingSettings(false);
    setTimeout(() => setSuccessMsg(''), 3000);
  }
};

  // ===== ✅ خدمات: إضافة/تعديل (مصحح) =====
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const method = editingServiceId ? 'PUT' : 'POST';
      
      const serviceData = {
        title: serviceForm.title || '',
        slug: serviceForm.slug || '',
        short_description: serviceForm.shortDescription || '',
        description: serviceForm.description || '',
        content: serviceForm.content || '',
        price: serviceForm.price || '',
        image: serviceForm.image || '',
        icon: serviceForm.icon || '🧹',
        category: serviceForm.category || '',
        features: serviceForm.features || [],
        active: serviceForm.active !== undefined ? serviceForm.active : true,
        featured: serviceForm.featured || false,
        order: serviceForm.order || 0
      };
      
      if (editingServiceId) {
        serviceData.id = editingServiceId;
      }
      
      const res = await fetch('/api/services', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData)
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'فشل الحفظ');
      }
      
      fetchAllData();
      resetServiceForm();
      setSuccessMsg(editingServiceId ? '✅ تم تعديل الخدمة بنجاح' : '✅ تم إضافة الخدمة بنجاح');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Service save error:', err);
      setSuccessMsg('❌ خطأ: ' + err.message);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // ===== ✅ خدمات: حذف (مصحح نهائياً) =====
  const handleServiceDelete = async (id) => {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذه الخدمة؟')) return;
    
    try {
      const res = await fetch('/api/services', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(id) })
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'فشل الحذف');
      }
      
      fetchAllData();
      setSuccessMsg('🗑️ تم حذف الخدمة بنجاح');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setSuccessMsg('❌ خطأ: ' + err.message);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleServiceEdit = (service) => {
    setServiceForm({
      slug: service.slug || '',
      title: service.title || '',
      shortDescription: service.short_description || service.shortDescription || '',
      description: service.description || '',
      content: service.content || '',
      price: service.price || '',
      image: service.image || '',
      icon: service.icon || '🧹',
      category: service.category || '',
      features: Array.isArray(service.features) ? service.features : (service.features ? service.features.split(',') : []),
      seo: service.seo || { metaTitle: '', metaDescription: '', keywords: '' },
      active: service.active !== undefined ? service.active : true,
      featured: service.featured || false,
      order: service.order || 0
    });
    setEditingServiceId(service.id);
    setActiveTab('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetServiceForm = () => {
    setServiceForm({ 
      slug: '', title: '', shortDescription: '', description: '', content: '', price: '', image: '', icon: '🧹', 
      category: '', features: [],
      seo: { metaTitle: '', metaDescription: '', keywords: '' },
      active: true, featured: false, order: 0 
    });
    setEditingServiceId(null);
  };

  // ===== ✅ مقالات: إضافة/تعديل (مصحح) =====
  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const method = editingArticleId ? 'PUT' : 'POST';
      
      const articleData = {
        title: articleForm.title || '',
        slug: articleForm.slug || '',
        excerpt: articleForm.excerpt || '',
        content: articleForm.content || '',
        image: articleForm.image || '',
        category: articleForm.category || '',
        tags: articleForm.tags ? (typeof articleForm.tags === 'string' ? articleForm.tags.split(',').map(t => t.trim()) : articleForm.tags) : [],
        author: articleForm.author || 'فريق نور كلين',
        active: articleForm.active !== undefined ? articleForm.active : true,
        published_at: articleForm.published_at || new Date().toISOString()
      };
      
      if (editingArticleId) {
        articleData.id = editingArticleId;
      }
      
      const res = await fetch('/api/articles', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData)
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'فشل الحفظ');
      }
      
      fetchAllData();
      resetArticleForm();
      setSuccessMsg(editingArticleId ? '✅ تم تعديل المقال بنجاح' : '✅ تم إضافة المقال بنجاح');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Article save error:', err);
      setSuccessMsg('❌ خطأ: ' + err.message);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // ===== ✅ مقالات: حذف (مصحح نهائياً) =====
  const handleArticleDelete = async (id) => {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذا المقال؟')) return;
    
    try {
      const res = await fetch('/api/articles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(id) })
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'فشل الحذف');
      }
      
      fetchAllData();
      setSuccessMsg('🗑️ تم حذف المقال بنجاح');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setSuccessMsg('❌ خطأ: ' + err.message);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleArticleEdit = (article) => {
    setArticleForm({
      slug: article.slug || '',
      title: article.title || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      image: article.image || '',
      category: article.category || '',
      tags: Array.isArray(article.tags) ? article.tags.join(', ') : (article.tags || ''),
      author: article.author || 'فريق نور كلين',
      seo: article.seo || { metaTitle: '', metaDescription: '', keywords: '' },
      active: article.active !== undefined ? article.active : true
    });
    setEditingArticleId(article.id);
    setActiveTab('articles');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetArticleForm = () => {
    setArticleForm({ 
      slug: '', title: '', excerpt: '', content: '', image: '', category: '', tags: '', author: 'فريق نور كلين',
      seo: { metaTitle: '', metaDescription: '', keywords: '' },
      active: true, readTime: '5 دقائق' 
    });
    setEditingArticleId(null);
  };

  // ===== طلبات: تحديث الحالة =====
  const handleOrderStatus = async (orderId, status) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    try {
      await fetch('/api/orders', { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ id: orderId, status, ...order }) 
      });
      fetchAllData();
      setSuccessMsg('✅ تم تحديث حالة الطلب');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Order update error:', err);
      setSuccessMsg('❌ خطأ: ' + err.message);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // ===== حالة التحميل =====
  if (!isAuthenticated) {
    return (
      <Layout>
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '50px', height: '50px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #10b981',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }} />
            <p style={{ color: '#6b7280' }}>جاري التحميل...</p>
          </div>
        </div>
        <style jsx>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>لوحة التحكم | نور كلين</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <Layout>
        <div className="dashboard-container" style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '30px',
            padding: '20px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>⚙️ لوحة تحكم نور كلين</h1>
            <button 
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#dc2626'}
              onMouseLeave={(e) => e.target.style.background = '#ef4444'}
            >
              🚪 خروج
            </button>
          </div>

          {/* Stats */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px',
            marginBottom: '30px'
          }}>
            <div style={{ padding: '20px', background: '#ecfdf5', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981', display: 'block' }}>
                {services.filter(s => s.active).length}
              </span>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>الخدمات النشطة</span>
            </div>
            <div style={{ padding: '20px', background: '#dbeafe', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: '#3b82f6', display: 'block' }}>
                {articles.filter(a => a.active).length}
              </span>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>المقالات</span>
            </div>
            <div style={{ padding: '20px', background: '#fef3c7', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b', display: 'block' }}>
                {orders.filter(o => o.status === 'pending').length}
              </span>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>طلبات معلقة</span>
            </div>
            <div style={{ padding: '20px', background: '#f3f4f6', borderRadius: '12px', textAlign: 'center' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: '#6b7280', display: 'block' }}>
                {orders.length}
              </span>
              <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>إجمالي الطلبات</span>
            </div>
          </div>

          {/* Success Message */}
          {successMsg && (
            <div style={{
              background: '#ecfdf5',
              color: '#059669',
              padding: '15px 20px',
              borderRadius: '12px',
              marginBottom: '25px',
              textAlign: 'center',
              fontWeight: '500',
              animation: 'fadeIn 0.3s ease'
            }}>
              {successMsg}
            </div>
          )}

          {/* Main Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '25px' }}>
            
            {/* Sidebar */}
            <aside style={{ 
              background: 'white', 
              borderRadius: '16px', 
              padding: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              height: 'fit-content'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#111827', marginBottom: '20px' }}>📋 القائمة</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { id: 'overview', label: '📊 نظرة عامة' },
                  { id: 'services', label: '🧹 الخدمات' },
                  { id: 'articles', label: '📝 المقالات' },
                  { id: 'orders', label: '📦 الطلبات' },
                  { id: 'settings', label: '⚙️ الإعدادات' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '12px 16px',
                      background: activeTab === tab.id ? '#10b981' : 'transparent',
                      color: activeTab === tab.id ? 'white' : '#374151',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: activeTab === tab.id ? '600' : '500',
                      textAlign: 'right',
                      transition: 'all 0.2s',
                      fontSize: '0.95rem'
                    }}
                    onMouseEnter={(e) => {
                      if (activeTab !== tab.id) {
                        e.target.style.background = '#f3f4f6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeTab !== tab.id) {
                        e.target.style.background = 'transparent';
                      }
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </aside>

            {/* Content */}
            <main>
              
              {/* ===== نظرة عامة ===== */}
              {activeTab === 'overview' && (
                <div style={{ background: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#111827', marginBottom: '25px' }}>📊 نظرة عامة على الموقع</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>
                    <div style={{ padding: '20px', background: '#ecfdf5', borderRadius: '12px' }}>
                      <h4 style={{ color: '#065f46', marginBottom: '10px', fontSize: '0.95rem' }}>الخدمات</h4>
                      <p style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981', margin: 0 }}>
                        {services.filter(s => s.active).length}
                      </p>
                    </div>
                    <div style={{ padding: '20px', background: '#dbeafe', borderRadius: '12px' }}>
                      <h4 style={{ color: '#1e40af', marginBottom: '10px', fontSize: '0.95rem' }}>المقالات</h4>
                      <p style={{ fontSize: '2rem', fontWeight: '800', color: '#3b82f6', margin: 0 }}>
                        {articles.filter(a => a.active).length}
                      </p>
                    </div>
                    <div style={{ padding: '20px', background: '#fef3c7', borderRadius: '12px' }}>
                      <h4 style={{ color: '#92400e', marginBottom: '10px', fontSize: '0.95rem' }}>طلبات معلقة</h4>
                      <p style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b', margin: 0 }}>
                        {orders.filter(o => o.status === 'pending').length}
                      </p>
                    </div>
                    <div style={{ padding: '20px', background: '#f3f4f6', borderRadius: '12px' }}>
                      <h4 style={{ color: '#374151', marginBottom: '10px', fontSize: '0.95rem' }}>إجمالي الطلبات</h4>
                      <p style={{ fontSize: '2rem', fontWeight: '800', color: '#6b7280', margin: 0 }}>
                        {orders.length}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== الخدمات ===== */}
              {activeTab === 'services' && (
                <>
                  {/* Form */}
                  <div style={{ background: 'white', borderRadius: '16px', padding: '25px', marginBottom: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                      {editingServiceId ? '✏️ تعديل خدمة' : '➕ إضافة خدمة جديدة'}
                    </h2>
                    
                    {/* قوالب جاهزة */}
                    <div style={{ marginBottom: '20px', padding: '15px', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                      <span style={{ fontSize: '0.9rem', color: '#6b7280', display: 'block', marginBottom: '10px' }}>📦 قوالب خدمات جاهزة:</span>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button onClick={() => addServiceFromTemplate('خزانات')} style={{ padding: '6px 12px', background: '#dbeafe', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', color: '#1e40af' }}>💧 خزانات</button>
                        <button onClick={() => addServiceFromTemplate('نمل أبيض')} style={{ padding: '6px 12px', background: '#fef3c7', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', color: '#92400e' }}>🐜 نمل أبيض</button>
                        <button onClick={() => addServiceFromTemplate('تكييف')} style={{ padding: '6px 12px', background: '#ecfdf5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', color: '#065f46' }}>❄️ تكييف</button>
                        <button onClick={() => addServiceFromTemplate('سجاد')} style={{ padding: '6px 12px', background: '#fce7f3', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', color: '#9d174d' }}>🧶 سجاد</button>
                        <button onClick={() => addServiceFromTemplate('رخام')} style={{ padding: '6px 12px', background: '#f3f4f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', color: '#374151' }}>✨ رخام</button>
                        <button onClick={() => addServiceFromTemplate('حمام')} style={{ padding: '6px 12px', background: '#e0e7ff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', color: '#3730a3' }}>🕊️ طرد حمام</button>
                      </div>
                    </div>
                    
                    <form onSubmit={handleServiceSubmit}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>الرابط (slug) *</label>
                          <input className="form-input" placeholder="مثال: pest-control" value={serviceForm.slug || ''} onChange={e => setServiceForm({...serviceForm, slug: e.target.value})} required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', direction: 'ltr' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>الأيقونة *</label>
                          <input className="form-input" placeholder="🧹" value={serviceForm.icon || ''} onChange={e => setServiceForm({...serviceForm, icon: e.target.value})} required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>عنوان الخدمة *</label>
                          <input className="form-input" placeholder="مثال: مكافحة حشرات بالرياض" value={serviceForm.title || ''} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>التصنيف</label>
                          <input className="form-input" placeholder="مثال: مكافحة حشرات" value={serviceForm.category || ''} onChange={e => setServiceForm({...serviceForm, category: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                        </div>
                      </div>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>وصف قصير *</label>
                        <textarea className="form-textarea" placeholder="يظهر في قائمة الخدمات" value={serviceForm.shortDescription || ''} onChange={e => setServiceForm({...serviceForm, shortDescription: e.target.value})} rows="2" required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', resize: 'vertical' }} />
                      </div>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>محتوى الخدمة الكامل *</label>
                        <textarea className="form-textarea" placeholder="التفاصيل الكاملة للخدمة" value={serviceForm.content || ''} onChange={e => setServiceForm({...serviceForm, content: e.target.value})} rows="5" required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', resize: 'vertical' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>رابط الصورة</label>
                          <input className="form-input" placeholder="https://example.com/image.jpg" value={serviceForm.image || ''} onChange={e => setServiceForm({...serviceForm, image: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', direction: 'ltr' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>السعر</label>
                          <input className="form-input" placeholder="مثال: يبدأ من 200 ريال" value={serviceForm.price || ''} onChange={e => setServiceForm({...serviceForm, price: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                        </div>
                      </div>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>المميزات (افصل بفاصلة)</label>
                        <input className="form-input" placeholder="ضمان كامل, مواد آمنة, فريق محترف" value={Array.isArray(serviceForm.features) ? serviceForm.features.join(', ') : ''} onChange={e => setServiceForm({...serviceForm, features: e.target.value.split(',').map(f => f.trim())})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                      </div>
                      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontSize: '0.9rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={serviceForm.active || false} onChange={e => setServiceForm({...serviceForm, active: e.target.checked})} style={{ width: '18px', height: '18px', cursor: 'pointer' }} /> نشط (يظهر في الموقع)
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontSize: '0.9rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={serviceForm.featured || false} onChange={e => setServiceForm({...serviceForm, featured: e.target.checked})} style={{ width: '18px', height: '18px', cursor: 'pointer' }} /> خدمة مميزة
                        </label>
                      </div>
                      
                      {/* SEO Box */}
                      <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '15px' }}>🔍 إعدادات الأرشفة (SEO)</h4>
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>عنوان الصفحة في جوجل</label>
                          <input className="form-input" value={serviceForm.seo?.metaTitle || ''} onChange={e => setServiceForm({...serviceForm, seo: {...serviceForm.seo, metaTitle: e.target.value}})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>وصف الصفحة في جوجل</label>
                          <textarea className="form-textarea" value={serviceForm.seo?.metaDescription || ''} onChange={e => setServiceForm({...serviceForm, seo: {...serviceForm.seo, metaDescription: e.target.value}})} rows="2" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', resize: 'vertical' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>الكلمات المفتاحية</label>
                          <input className="form-input" value={serviceForm.seo?.keywords || ''} onChange={e => setServiceForm({...serviceForm, seo: {...serviceForm.seo, keywords: e.target.value}})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '1rem', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                          {editingServiceId ? '💾 حفظ التعديلات' : '➕ إضافة الخدمة'}
                        </button>
                        {editingServiceId && (
                          <button type="button" onClick={resetServiceForm} className="cancel-btn" style={{ padding: '12px 24px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', fontWeight: '500', cursor: 'pointer', fontSize: '1rem' }}>
                            إلغاء
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                  
                  {/* Services List */}
                  <div style={{ background: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>📋 الخدمات الحالية ({services.length})</h2>
                    <div>
                      {services.length > 0 ? (
                        services.map(service => (
                          <div key={service.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #f3f4f6', gap: '15px' }}>
                            <div>
                              <strong style={{ color: '#111827', fontSize: '1rem' }}>{service.icon} {service.title}</strong>
                              <br />
                              <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>/{service.slug}</span>
                              {!service.active && (<span style={{ marginRight: '10px', color: '#ef4444', fontSize: '0.85rem' }}>(مخفي)</span>)}
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => handleServiceEdit(service)} className="edit-btn" style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}>✏️ تعديل</button>
                              <button onClick={() => handleServiceDelete(service.id)} className="delete-btn" style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}>🗑️ حذف</button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>لا توجد خدمات مضافة بعد</div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ===== المقالات ===== */}
              {activeTab === 'articles' && (
                <>
                  <div style={{ background: 'white', borderRadius: '16px', padding: '25px', marginBottom: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>
                      {editingArticleId ? '✏️ تعديل مقال' : '➕ إضافة مقال جديد'}
                    </h2>
                    <form onSubmit={handleArticleSubmit}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>الرابط (slug) *</label>
                          <input className="form-input" placeholder="مثال: best-pest-control" value={articleForm.slug || ''} onChange={e => setArticleForm({...articleForm, slug: e.target.value})} required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', direction: 'ltr' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>التصنيف</label>
                          <input className="form-input" placeholder="مثال: مكافحة حشرات" value={articleForm.category || ''} onChange={e => setArticleForm({...articleForm, category: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                        </div>
                      </div>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>عنوان المقال *</label>
                        <input className="form-input" placeholder="عنوان المقال" value={articleForm.title || ''} onChange={e => setArticleForm({...articleForm, title: e.target.value})} required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                      </div>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>مقدمة المقال *</label>
                        <textarea className="form-textarea" placeholder="مقدمة قصيرة" value={articleForm.excerpt || ''} onChange={e => setArticleForm({...articleForm, excerpt: e.target.value})} rows="2" required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', resize: 'vertical' }} />
                      </div>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>محتوى المقال الكامل *</label>
                        <textarea className="form-textarea" placeholder="اكتب المحتوى الكامل هنا" value={articleForm.content || ''} onChange={e => setArticleForm({...articleForm, content: e.target.value})} rows="8" required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', resize: 'vertical' }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>رابط الصورة</label>
                          <input className="form-input" placeholder="https://example.com/image.jpg" value={articleForm.image || ''} onChange={e => setArticleForm({...articleForm, image: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', direction: 'ltr' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>الكلمات الدلالية (افصل بفاصلة)</label>
                          <input className="form-input" placeholder="افصل بفاصلة" value={Array.isArray(articleForm.tags) ? articleForm.tags.join(', ') : articleForm.tags || ''} onChange={e => setArticleForm({...articleForm, tags: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                        </div>
                      </div>
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#374151', fontSize: '0.9rem', cursor: 'pointer' }}>
                          <input type="checkbox" checked={articleForm.active || false} onChange={e => setArticleForm({...articleForm, active: e.target.checked})} style={{ width: '18px', height: '18px', cursor: 'pointer' }} /> نشط (يظهر في الموقع)
                        </label>
                      </div>
                      
                      {/* SEO Box */}
                      <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', marginBottom: '15px' }}>🔍 إعدادات الأرشفة (SEO)</h4>
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>عنوان جوجل</label>
                          <input className="form-input" value={articleForm.seo?.metaTitle || ''} onChange={e => setArticleForm({...articleForm, seo: {...articleForm.seo, metaTitle: e.target.value}})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                          <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>وصف جوجل</label>
                          <textarea className="form-textarea" value={articleForm.seo?.metaDescription || ''} onChange={e => setArticleForm({...articleForm, seo: {...articleForm.seo, metaDescription: e.target.value}})} rows="2" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', resize: 'vertical' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>الكلمات المفتاحية</label>
                          <input className="form-input" value={articleForm.seo?.keywords || ''} onChange={e => setArticleForm({...articleForm, seo: {...articleForm.seo, keywords: e.target.value}})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="submit" className="btn btn-primary btn-lg" style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '1rem' }}>
                          {editingArticleId ? '💾 حفظ التعديلات' : '➕ إضافة المقال'}
                        </button>
                        {editingArticleId && (
                          <button type="button" onClick={resetArticleForm} style={{ padding: '12px 24px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', fontWeight: '500', cursor: 'pointer', fontSize: '1rem' }}>
                            إلغاء
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                  
                  <div style={{ background: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>📰 المقالات الحالية ({articles.length})</h2>
                    <div>
                      {articles.length > 0 ? (
                        articles.map(article => (
                          <div key={article.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #f3f4f6', gap: '15px' }}>
                            <div>
                              <strong style={{ color: '#111827', fontSize: '1rem' }}>📝 {article.title}</strong>
                              <br />
                              <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>/{article.slug}</span>
                              <span style={{ marginRight: '10px', color: '#6b7280', fontSize: '0.85rem' }}>{article.category}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button onClick={() => handleArticleEdit(article)} style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}>✏️ تعديل</button>
                              <button onClick={() => handleArticleDelete(article.id)} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500' }}>🗑️ حذف</button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>لا توجد مقالات مضافة بعد</div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ===== الطلبات ===== */}
              {activeTab === 'orders' && (
                <div style={{ background: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>📦 إدارة الطلبات ({orders.length})</h2>
                  <div>
                    {orders.length > 0 ? (
                      orders.map(order => (
                        <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #f3f4f6', gap: '15px', flexWrap: 'wrap' }}>
                          <div>
                            <strong style={{ color: '#111827', fontSize: '1rem' }}>👤 {order.name}</strong>
                            <br />
                            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>📞 {order.phone}</span>
                            <br />
                            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>🧹 {order.service}</span>
                            <br />
                            <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>📅 {new Date(order.createdAt).toLocaleDateString('ar-SA')}</span>
                          </div>
                          <div>
                            <select value={order.status || 'pending'} onChange={(e) => handleOrderStatus(order.id, e.target.value)} className="form-input" style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: '0.9rem' }}>
                              <option value="pending">⏳ معلق</option>
                              <option value="processing">🔄 قيد المعالجة</option>
                              <option value="completed">✅ مكتمل</option>
                              <option value="cancelled">❌ ملغي</option>
                            </select>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>لا توجد طلبات بعد</div>
                    )}
                  </div>
                </div>
              )}

              {/* ===== الإعدادات ===== */}
              {activeTab === 'settings' && (
                <div style={{ background: 'white', borderRadius: '16px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#111827', marginBottom: '20px' }}>⚙️ إعدادات الموقع العامة</h2>
                  <form onSubmit={handleSettingsSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>اسم الموقع</label>
                        <input className="form-input" value={settingsForm.siteName || ''} onChange={e => setSettingsForm({...settingsForm, siteName: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>الشعار اللفظي</label>
                        <input className="form-input" value={settingsForm.tagline || ''} onChange={e => setSettingsForm({...settingsForm, tagline: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>رقم الهاتف</label>
                        <input className="form-input" value={settingsForm.phone || ''} onChange={e => setSettingsForm({...settingsForm, phone: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', direction: 'ltr' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>رقم واتساب (مع كود الدولة)</label>
                        <input className="form-input" value={settingsForm.whatsapp || ''} onChange={e => setSettingsForm({...settingsForm, whatsapp: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', direction: 'ltr' }} />
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>البريد الإلكتروني</label>
                        <input className="form-input" value={settingsForm.email || ''} onChange={e => setSettingsForm({...settingsForm, email: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', direction: 'ltr' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>ساعات العمل</label>
                        <input className="form-input" value={settingsForm.workingHours || ''} onChange={e => setSettingsForm({...settingsForm, workingHours: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                      </div>
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>العنوان</label>
                      <input className="form-input" value={settingsForm.address || ''} onChange={e => setSettingsForm({...settingsForm, address: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                    </div>
                    <div style={{ marginBottom: '25px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', color: '#374151', fontWeight: '500', fontSize: '0.9rem' }}>كلمة مرور الأدمن</label>
                      <input className="form-input" type="password" value={settingsForm.adminPassword || ''} onChange={e => setSettingsForm({...settingsForm, adminPassword: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', direction: 'ltr' }} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg" disabled={savingSettings} style={{ padding: '12px 24px', background: savingSettings ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: savingSettings ? 'not-allowed' : 'pointer', fontSize: '1rem', transition: 'background 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {savingSettings ? (
                        <>
                          <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                          جاري الحفظ...
                        </>
                      ) : (
                        '💾 حفظ الإعدادات'
                      )}
                    </button>
                  </form>
                </div>
              )}

            </main>
          </div>
        </div>
      </Layout>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
      `}</style>
    </>
  );
}