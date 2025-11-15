import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  structuredData?: Record<string, unknown> | null;
}

const SEOHead = ({ 
  title = 'Social Caution - Privacy Protection Platform',
  description = 'A comprehensive privacy assessment and education platform that helps users understand and improve their digital privacy through interactive assessments, personalized recommendations, and educational resources.',
  keywords = 'privacy assessment, digital privacy, data protection, cybersecurity, privacy persona, GDPR rights, CCPA compliance, privacy tools, security assessment, personal data protection',
  ogImage = '/socialcaution.png',
  canonicalUrl,
  structuredData = null
}: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create viewport meta tag
    const updateOrCreateMeta = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        if (property || name.startsWith('og:') || name.startsWith('twitter:')) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    // Basic SEO meta tags
    updateOrCreateMeta('description', description);
    updateOrCreateMeta('keywords', keywords);
    updateOrCreateMeta('author', 'Social Caution');
    updateOrCreateMeta('robots', 'index, follow, max-snippet:-1, max-video-preview:-1, max-image-preview:large');
    updateOrCreateMeta('viewport', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
    updateOrCreateMeta('theme-color', '#ef4444');
    updateOrCreateMeta('color-scheme', 'light dark');

    // Open Graph tags
    updateOrCreateMeta('og:title', title, true);
    updateOrCreateMeta('og:description', description, true);
    updateOrCreateMeta('og:type', 'website', true);
    updateOrCreateMeta('og:image', `${window.location.origin}${ogImage}`, true);
    updateOrCreateMeta('og:image:width', '512', true);
    updateOrCreateMeta('og:image:height', '512', true);
    updateOrCreateMeta('og:site_name', 'Social Caution', true);
    updateOrCreateMeta('og:url', window.location.href, true);
    updateOrCreateMeta('og:locale', 'en_US', true);

    // Twitter Card tags
    updateOrCreateMeta('twitter:card', 'summary_large_image', true);
    updateOrCreateMeta('twitter:title', title, true);
    updateOrCreateMeta('twitter:description', description, true);
    updateOrCreateMeta('twitter:image', `${window.location.origin}${ogImage}`, true);

    // Additional SEO tags
    updateOrCreateMeta('application-name', 'Social Caution');
    updateOrCreateMeta('apple-mobile-web-app-capable', 'yes');
    updateOrCreateMeta('apple-mobile-web-app-status-bar-style', 'default');
    updateOrCreateMeta('apple-mobile-web-app-title', 'Social Caution');
    updateOrCreateMeta('format-detection', 'telephone=no');

    // Canonical URL
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (canonical) {
        canonical.setAttribute('href', canonicalUrl);
      } else {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        canonical.setAttribute('href', canonicalUrl);
        document.head.appendChild(canonical);
      }
    }

    // Add structured data if provided
    if (structuredData) {
      let structuredDataScript = document.querySelector('script[type="application/ld+json"]#seo-structured-data') as HTMLScriptElement;
      if (structuredDataScript) {
        structuredDataScript.textContent = JSON.stringify(structuredData, null, 2);
      } else {
        structuredDataScript = document.createElement('script');
        structuredDataScript.type = 'application/ld+json';
        structuredDataScript.id = 'seo-structured-data';
        structuredDataScript.textContent = JSON.stringify(structuredData, null, 2);
        document.head.appendChild(structuredDataScript);
      }
    }
  }, [title, description, keywords, ogImage, canonicalUrl, structuredData]);

  return null;
};

export default SEOHead;

