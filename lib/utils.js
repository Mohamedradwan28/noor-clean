// lib/utils.js - دوال مساعدة عامة

// ===== التعامل مع التواريخ =====
export function parseDate(dateValue) {
  if (!dateValue) return new Date();
  const date = new Date(dateValue);
  return isNaN(date.getTime()) ? new Date() : date;
}

export function formatDate(dateValue, locale = 'ar-EG') {
  const date = parseDate(dateValue);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function getISODate(dateValue) {
  return parseDate(dateValue).toISOString();
}

// ===== وقت القراءة =====
export function getReadTime(content, wordsPerMinute = 200) {
  if (!content) return '1 دقيقة';
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} دقيقة قراءة`;
}

// ===== تنسيق النصوص =====
export function truncateText(text, maxLength = 150) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// ===== SEO Helpers =====
export function generateStructuredData(type, data) {
  const base = {
    "@context": "https://schema.org",
    "@type": type,
    ...data
  };
  return JSON.stringify(base);
}

// ===== Validation =====
export function isValidDate(dateValue) {
  const date = new Date(dateValue);
  return !isNaN(date.getTime());
}

export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}