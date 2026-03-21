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
  const [activeTab, setActiveTab] = useState('overview');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [serviceForm, setServiceForm] = useState({
    slug: '', title: '', shortDescription: '', description: '', content: '', price: '', image: '', icon: '🧹',
    category: '', features: [],
    seo: { metaTitle: '', metaDescription: '', keywords: '' },
    active: true, featured: false, order: 0
  });
  const [editingServiceId, setEditingServiceId] = useState(null);
  
  const [articleForm, setArticleForm] = useState({
    slug: '', title: '', excerpt: '', content: '', image: '', category: '', tags: '', author: 'فريق نور كلين',
    seo: { metaTitle: '', metaDescription: '', keywords: '' },
    active: true, readTime: '5 دقائق'
  });
  const [editingArticleId, setEditingArticleId] = useState(null);
  
  const [settingsForm, setSettingsForm] = useState({});

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

  const fetchAllData = () => {
    fetch('/api/services?admin=true').then(res => res.json()).then(setServices);
    fetch('/api/articles?admin=true').then(res => res.json()).then(setArticles);
    fetch('/api/orders').then(res => res.json()).then(setOrders);
    fetch('/api/settings').then(res => res.json()).then(data => {
      setSettings(data);
      setSettingsForm(data);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminLoginTime');
    router.push('/admin/login');
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    const method = editingServiceId ? 'PUT' : 'POST';
    const body = editingServiceId ? { ...serviceForm, id: editingServiceId } : serviceForm;
    await fetch('/api/services', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    fetchAllData();
    resetServiceForm();
    setSuccessMsg(editingServiceId ? '✅ تم تعديل الخدمة بنجاح' : '✅ تم إضافة الخدمة بنجاح');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleServiceDelete = async (id) => {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذه الخدمة؟')) return;
    await fetch('/api/services', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchAllData();
    setSuccessMsg('🗑️ تم حذف الخدمة بنجاح');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleServiceEdit = (service) => {
    setServiceForm(service);
    setEditingServiceId(service.id);
    setActiveTab('services');
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const resetServiceForm = () => {
    setServiceForm({ slug: '', title: '', shortDescription: '', description: '', content: '', price: '', image: '', icon: '🧹', category: '', features: [], seo: { metaTitle: '', metaDescription: '', keywords: '' }, active: true, featured: false, order: 0 });
    setEditingServiceId(null);
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    const method = editingArticleId ? 'PUT' : 'POST';
    const body = editingArticleId ? { ...articleForm, id: editingArticleId } : articleForm;
    await fetch('/api/articles', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    fetchAllData();
    resetArticleForm();
    setSuccessMsg(editingArticleId ? '✅ تم تعديل المقال بنجاح' : '✅ تم إضافة المقال بنجاح');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleArticleDelete = async (id) => {
    if (!confirm('⚠️ هل أنت متأكد من حذف هذا المقال؟')) return;
    await fetch('/api/articles', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchAllData();
    setSuccessMsg('🗑️ تم حذف المقال بنجاح');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleArticleEdit = (article) => {
    setArticleForm(article);
    setEditingArticleId(article.id);
    setActiveTab('articles');
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const resetArticleForm = () => {
    setArticleForm({ slug: '', title: '', excerpt: '', content: '', image: '', category: '', tags: '', author: 'فريق نور كلين', seo: { metaTitle: '', metaDescription: '', keywords: '' }, active: true, readTime: '5 دقائق' });
    setEditingArticleId(null);
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settingsForm) });
    setSuccessMsg('✅ تم حفظ إعدادات الموقع بنجاح');
    setTimeout(() => setSuccessMsg(''), 3000);
    fetchAllData();
  };

  const handleOrderStatus = async (orderId, status) => {
    const order = orders.find(o => o.id === orderId);
    await fetch('/api/orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: orderId, status, ...order }) });
    fetchAllData();
    setSuccessMsg('✅ تم تحديث حالة الطلب');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  if (!isAuthenticated) return <Layout><div className="loading"><div className="loading-spinner"></div></div></Layout>;

  return (
    <>
      <Head>
        <title>لوحة التحكم | نور كلين</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Layout title="لوحة التحكم">
        <div className="dashboard-container">
          <div className="container">
            <div className="dashboard-header">
              <h1>⚙️ لوحة تحكم نور كلين</h1>
              <button onClick={handleLogout} className="btn btn-danger">🚪 تسجيل الخروج</button>
            </div>

            <div className="dashboard-stats">
              <div className="dashboard-stat-card">
                <span className="dashboard-stat-number">{services.filter(s => s.active).length}</span>
                <span className="dashboard-stat-label">الخدمات النشطة</span>
              </div>
              <div className="dashboard-stat-card">
                <span className="dashboard-stat-number">{articles.filter(a => a.active).length}</span>
                <span className="dashboard-stat-label">المقالات</span>
              </div>
              <div className="dashboard-stat-card">
                <span className="dashboard-stat-number">{orders.filter(o => o.status === 'pending').length}</span>
                <span className="dashboard-stat-label">الطلبات المعلقة</span>
              </div>
              <div className="dashboard-stat-card">
                <span className="dashboard-stat-number">{orders.length}</span>
                <span className="dashboard-stat-label">إجمالي الطلبات</span>
              </div>
            </div>

            {successMsg && <div className="success-message">{successMsg}</div>}

            <div className="dashboard-grid">
              <aside className="dashboard-sidebar">
                <h3>📋 القائمة الرئيسية</h3>
                <div className="dashboard-menu">
                  <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>📊 نظرة عامة</button>
                  <button className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}>🧹 إدارة الخدمات</button>
                  <button className={activeTab === 'articles' ? 'active' : ''} onClick={() => setActiveTab('articles')}>📝 إدارة المقالات</button>
                  <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>📦 الطلبات</button>
                  <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>⚙️ إعدادات الموقع</button>
                </div>
              </aside>

              <main className="dashboard-content">
                {activeTab === 'overview' && (
                  <div className="dashboard-card">
                    <h2>📊 نظرة عامة على الموقع</h2>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px'}}>
                      <div style={{padding: '25px', background: 'var(--primary-light)', borderRadius: 'var(--radius-lg)'}}>
                        <h4 style={{color: 'var(--primary-dark)', marginBottom: '10px'}}>الخدمات</h4>
                        <p style={{fontSize: '2rem', fontWeight: '900', color: 'var(--primary)'}}>{services.filter(s => s.active).length}</p>
                      </div>
                      <div style={{padding: '25px', background: 'var(--info-light)', borderRadius: 'var(--radius-lg)'}}>
                        <h4 style={{color: 'var(--info)', marginBottom: '10px'}}>المقالات</h4>
                        <p style={{fontSize: '2rem', fontWeight: '900', color: 'var(--info)'}}>{articles.filter(a => a.active).length}</p>
                      </div>
                      <div style={{padding: '25px', background: 'var(--warning-light)', borderRadius: 'var(--radius-lg)'}}>
                        <h4 style={{color: 'var(--warning)', marginBottom: '10px'}}>طلبات معلقة</h4>
                        <p style={{fontSize: '2rem', fontWeight: '900', color: 'var(--warning)'}}>{orders.filter(o => o.status === 'pending').length}</p>
                      </div>
                      <div style={{padding: '25px', background: 'var(--success-light)', borderRadius: 'var(--radius-lg)'}}>
                        <h4 style={{color: 'var(--success)', marginBottom: '10px'}}>إجمالي الطلبات</h4>
                        <p style={{fontSize: '2rem', fontWeight: '900', color: 'var(--success)'}}>{orders.length}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'services' && (
                  <>
                    <div className="dashboard-card">
                      <h2>{editingServiceId ? '✏️ تعديل خدمة' : '➕ إضافة خدمة جديدة'}</h2>
                      <form onSubmit={handleServiceSubmit}>
                        <div className="form-row">
                          <div className="form-group">
                            <label>الرابط (slug) *</label>
                            <input className="form-input" placeholder="مثال: pest-control" value={serviceForm.slug} onChange={e => setServiceForm({...serviceForm, slug: e.target.value})} required style={{direction: 'ltr'}} />
                          </div>
                          <div className="form-group">
                            <label>الأيقونة *</label>
                            <input className="form-input" placeholder="🧹" value={serviceForm.icon} onChange={e => setServiceForm({...serviceForm, icon: e.target.value})} required />
                          </div>
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>عنوان الخدمة *</label>
                            <input className="form-input" placeholder="مثال: مكافحة حشرات بالرياض" value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} required />
                          </div>
                          <div className="form-group">
                            <label>التصنيف</label>
                            <input className="form-input" placeholder="مثال: مكافحة حشرات" value={serviceForm.category} onChange={e => setServiceForm({...serviceForm, category: e.target.value})} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>وصف قصير *</label>
                          <textarea className="form-textarea" placeholder="يظهر في قائمة الخدمات" value={serviceForm.shortDescription} onChange={e => setServiceForm({...serviceForm, shortDescription: e.target.value})} rows="2" required />
                        </div>
                        <div className="form-group">
                          <label>محتوى الخدمة الكامل *</label>
                          <textarea className="form-textarea" placeholder="التفاصيل الكاملة للخدمة" value={serviceForm.content} onChange={e => setServiceForm({...serviceForm, content: e.target.value})} rows="6" required />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>رابط الصورة</label>
                            <input className="form-input" placeholder="https://example.com/image.jpg" value={serviceForm.image} onChange={e => setServiceForm({...serviceForm, image: e.target.value})} style={{direction: 'ltr'}} />
                          </div>
                          <div className="form-group">
                            <label>السعر</label>
                            <input className="form-input" placeholder="مثال: يبدأ من 200 ريال" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: e.target.value})} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>المميزات (افصل بفاصلة)</label>
                          <input className="form-input" placeholder="ضمان كامل, مواد آمنة, فريق محترف" value={serviceForm.features?.join(', ')} onChange={e => setServiceForm({...serviceForm, features: e.target.value.split(',').map(f => f.trim())})} />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label><input type="checkbox" checked={serviceForm.active} onChange={e => setServiceForm({...serviceForm, active: e.target.checked})} style={{marginLeft: '10px'}} /> نشط (يظهر في الموقع)</label>
                          </div>
                          <div className="form-group">
                            <label><input type="checkbox" checked={serviceForm.featured} onChange={e => setServiceForm({...serviceForm, featured: e.target.checked})} style={{marginLeft: '10px'}} /> خدمة مميزة</label>
                          </div>
                        </div>
                        <div className="seo-box">
                          <h4>🔍 إعدادات الأرشفة (SEO)</h4>
                          <div className="form-group">
                            <label>عنوان الصفحة في جوجل</label>
                            <input className="form-input" value={serviceForm.seo.metaTitle} onChange={e => setServiceForm({...serviceForm, seo: {...serviceForm.seo, metaTitle: e.target.value}})} />
                          </div>
                          <div className="form-group">
                            <label>وصف الصفحة في جوجل</label>
                            <textarea className="form-textarea" value={serviceForm.seo.metaDescription} onChange={e => setServiceForm({...serviceForm, seo: {...serviceForm.seo, metaDescription: e.target.value}})} rows="2" />
                          </div>
                          <div className="form-group">
                            <label>الكلمات المفتاحية</label>
                            <input className="form-input" value={serviceForm.seo.keywords} onChange={e => setServiceForm({...serviceForm, seo: {...serviceForm.seo, keywords: e.target.value}})} />
                          </div>
                        </div>
                        <div>
                          <button type="submit" className="btn btn-primary btn-lg">{editingServiceId ? '💾 حفظ التعديلات' : '➕ إضافة الخدمة'}</button>
                          {editingServiceId && <button type="button" onClick={resetServiceForm} className="cancel-btn">إلغاء</button>}
                        </div>
                      </form>
                    </div>
                    <div className="dashboard-card">
                      <h2>📋 الخدمات الحالية ({services.length})</h2>
                      <div className="services-table">
                        {services.length > 0 ? (
                          services.map(service => (
                            <div key={service.id} className="service-row">
                              <div>
                                <strong>{service.icon} {service.title}</strong>
                                <br />
                                <span className="service-slug">/{service.slug}</span>
                                {!service.active && <span style={{marginRight: '10px', color: 'var(--danger)', fontSize: '0.85rem'}}>(مخفي)</span>}
                              </div>
                              <div className="service-actions">
                                <button onClick={() => handleServiceEdit(service)} className="edit-btn">✏️ تعديل</button>
                                <button onClick={() => handleServiceDelete(service.id)} className="delete-btn">🗑️ حذف</button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{padding: '50px', textAlign: 'center', color: 'var(--gray-600)'}}>لا توجد خدمات مضافة بعد</div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'articles' && (
                  <>
                    <div className="dashboard-card">
                      <h2>{editingArticleId ? '✏️ تعديل مقال' : '➕ إضافة مقال جديد'}</h2>
                      <form onSubmit={handleArticleSubmit}>
                        <div className="form-row">
                          <div className="form-group">
                            <label>الرابط (slug) *</label>
                            <input className="form-input" placeholder="مثال: best-pest-control" value={articleForm.slug} onChange={e => setArticleForm({...articleForm, slug: e.target.value})} required style={{direction: 'ltr'}} />
                          </div>
                          <div className="form-group">
                            <label>التصنيف</label>
                            <input className="form-input" placeholder="مثال: مكافحة حشرات" value={articleForm.category} onChange={e => setArticleForm({...articleForm, category: e.target.value})} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>عنوان المقال *</label>
                          <input className="form-input" placeholder="عنوان المقال" value={articleForm.title} onChange={e => setArticleForm({...articleForm, title: e.target.value})} required />
                        </div>
                        <div className="form-group">
                          <label>مقدمة المقال *</label>
                          <textarea className="form-textarea" placeholder="مقدمة قصيرة" value={articleForm.excerpt} onChange={e => setArticleForm({...articleForm, excerpt: e.target.value})} rows="2" required />
                        </div>
                        <div className="form-group">
                          <label>محتوى المقال الكامل *</label>
                          <textarea className="form-textarea" placeholder="اكتب المحتوى الكامل هنا" value={articleForm.content} onChange={e => setArticleForm({...articleForm, content: e.target.value})} rows="10" required />
                        </div>
                        <div className="form-row">
                          <div className="form-group">
                            <label>رابط الصورة</label>
                            <input className="form-input" placeholder="https://example.com/image.jpg" value={articleForm.image} onChange={e => setArticleForm({...articleForm, image: e.target.value})} style={{direction: 'ltr'}} />
                          </div>
                          <div className="form-group">
                            <label>الكلمات الدلالية (افصل بفاصلة)</label>
                            <input className="form-input" placeholder="افصل بفاصلة" value={articleForm.tags} onChange={e => setArticleForm({...articleForm, tags: e.target.value})} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label><input type="checkbox" checked={articleForm.active} onChange={e => setArticleForm({...articleForm, active: e.target.checked})} style={{marginLeft: '10px'}} /> نشط (يظهر في الموقع)</label>
                        </div>
                        <div className="seo-box">
                          <h4>🔍 إعدادات الأرشفة (SEO)</h4>
                          <div className="form-group">
                            <label>عنوان جوجل</label>
                            <input className="form-input" value={articleForm.seo.metaTitle} onChange={e => setArticleForm({...articleForm, seo: {...articleForm.seo, metaTitle: e.target.value}})} />
                          </div>
                          <div className="form-group">
                            <label>وصف جوجل</label>
                            <textarea className="form-textarea" value={articleForm.seo.metaDescription} onChange={e => setArticleForm({...articleForm, seo: {...articleForm.seo, metaDescription: e.target.value}})} rows="2" />
                          </div>
                          <div className="form-group">
                            <label>الكلمات المفتاحية</label>
                            <input className="form-input" value={articleForm.seo.keywords} onChange={e => setArticleForm({...articleForm, seo: {...articleForm.seo, keywords: e.target.value}})} />
                          </div>
                        </div>
                        <div>
                          <button type="submit" className="btn btn-primary btn-lg">{editingArticleId ? '💾 حفظ التعديلات' : '➕ إضافة المقال'}</button>
                          {editingArticleId && <button type="button" onClick={resetArticleForm} className="cancel-btn">إلغاء</button>}
                        </div>
                      </form>
                    </div>
                    <div className="dashboard-card">
                      <h2>📰 المقالات الحالية ({articles.length})</h2>
                      <div className="services-table">
                        {articles.length > 0 ? (
                          articles.map(article => (
                            <div key={article.id} className="service-row">
                              <div>
                                <strong>📝 {article.title}</strong>
                                <br />
                                <span className="service-slug">/{article.slug}</span>
                                <span style={{marginRight: '10px', color: 'var(--gray-500)', fontSize: '0.85rem'}}>{article.category}</span>
                              </div>
                              <div className="service-actions">
                                <button onClick={() => handleArticleEdit(article)} className="edit-btn">✏️ تعديل</button>
                                <button onClick={() => handleArticleDelete(article.id)} className="delete-btn">🗑️ حذف</button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{padding: '50px', textAlign: 'center', color: 'var(--gray-600)'}}>لا توجد مقالات مضافة بعد</div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'orders' && (
                  <div className="dashboard-card">
                    <h2>📦 إدارة الطلبات ({orders.length})</h2>
                    <div className="services-table">
                      {orders.length > 0 ? (
                        orders.map(order => (
                          <div key={order.id} className="service-row">
                            <div>
                              <strong>👤 {order.name}</strong>
                              <br />
                              <span style={{color: 'var(--gray-600)'}}>📞 {order.phone}</span>
                              <br />
                              <span style={{color: 'var(--gray-600)'}}>🧹 {order.service}</span>
                              <br />
                              <span style={{fontSize: '0.85rem', color: 'var(--gray-500)'}}>📅 {new Date(order.createdAt).toLocaleDateString('ar-SA')}</span>
                            </div>
                            <div>
                              <select value={order.status} onChange={(e) => handleOrderStatus(order.id, e.target.value)} className="form-input" style={{width: 'auto', marginBottom: '10px'}}>
                                <option value="pending">⏳ معلق</option>
                                <option value="processing">🔄 قيد المعالجة</option>
                                <option value="completed">✅ مكتمل</option>
                                <option value="cancelled">❌ ملغي</option>
                              </select>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{padding: '50px', textAlign: 'center', color: 'var(--gray-600)'}}>لا توجد طلبات بعد</div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="dashboard-card">
                    <h2>⚙️ إعدادات الموقع العامة</h2>
                    <form onSubmit={handleSettingsSubmit}>
                      <div className="form-row">
                        <div className="form-group">
                          <label>اسم الموقع</label>
                          <input className="form-input" value={settingsForm.siteName || ''} onChange={e => setSettingsForm({...settingsForm, siteName: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label>الشعار اللفظي</label>
                          <input className="form-input" value={settingsForm.tagline || ''} onChange={e => setSettingsForm({...settingsForm, tagline: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>رقم الهاتف</label>
                          <input className="form-input" value={settingsForm.phone || ''} onChange={e => setSettingsForm({...settingsForm, phone: e.target.value})} />
                        </div>
                        <div className="form-group">
                          <label>رقم واتساب (مع كود الدولة)</label>
                          <input className="form-input" value={settingsForm.whatsapp || ''} onChange={e => setSettingsForm({...settingsForm, whatsapp: e.target.value})} style={{direction: 'ltr'}} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>البريد الإلكتروني</label>
                          <input className="form-input" value={settingsForm.email || ''} onChange={e => setSettingsForm({...settingsForm, email: e.target.value})} style={{direction: 'ltr'}} />
                        </div>
                        <div className="form-group">
                          <label>ساعات العمل</label>
                          <input className="form-input" value={settingsForm.workingHours || ''} onChange={e => setSettingsForm({...settingsForm, workingHours: e.target.value})} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>العنوان</label>
                        <input className="form-input" value={settingsForm.address || ''} onChange={e => setSettingsForm({...settingsForm, address: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label>كلمة مرور الأدمن</label>
                        <input className="form-input" type="password" value={settingsForm.adminPassword || ''} onChange={e => setSettingsForm({...settingsForm, adminPassword: e.target.value})} style={{direction: 'ltr'}} />
                      </div>
                      <button type="submit" className="btn btn-primary btn-lg">💾 حفظ الإعدادات</button>
                    </form>
                  </div>
                )}
              </main>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}