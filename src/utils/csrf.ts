/**
 * CSRF Token Utility for Frontend
 * Handles CSRF token retrieval and inclusion in requests
 */

let csrfToken: string | null = null;

/**
 * Get CSRF token from cookie or fetch from server
 */
export async function getCsrfToken(): Promise<string | null> {
  // Try to get token from cookie first
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    const xsrfCookie = cookies.find((cookie) => 
      cookie.trim().startsWith('XSRF-TOKEN=')
    );
    
    if (xsrfCookie) {
      csrfToken = decodeURIComponent(xsrfCookie.split('=')[1]);
      return csrfToken;
    }
  }

  // If no cookie, fetch from server
  try {
    const response = await fetch('/api/csrf-token', {
      method: 'GET',
      credentials: 'include',
    });
    
    if (response.ok) {
      const data = await response.json();
      csrfToken = data.csrfToken;
      return csrfToken;
    }
  } catch (error) {
    console.warn('Failed to fetch CSRF token:', error);
  }

  return null;
}

/**
 * Get CSRF token synchronously (from cookie if available)
 */
export function getCsrfTokenSync(): string | null {
  if (typeof document === 'undefined') {
    return csrfToken;
  }

  const cookies = document.cookie.split(';');
  const xsrfCookie = cookies.find((cookie) => 
    cookie.trim().startsWith('XSRF-TOKEN=')
  );
  
  if (xsrfCookie) {
    csrfToken = decodeURIComponent(xsrfCookie.split('=')[1]);
    return csrfToken;
  }

  return csrfToken;
}

/**
 * Add CSRF token to fetch request headers
 */
export async function addCsrfTokenToHeaders(headers: HeadersInit = {}): Promise<HeadersInit> {
  const token = await getCsrfToken();
  
  if (token) {
    const headersObj = headers instanceof Headers ? headers : new Headers(headers);
    headersObj.set('X-CSRF-Token', token);
    return headersObj;
  }
  
  return headers;
}

/**
 * Add CSRF token to request body
 */
export async function addCsrfTokenToBody(body: Record<string, any>): Promise<Record<string, any>> {
  const token = await getCsrfToken();
  
  if (token) {
    return {
      ...body,
      _csrf: token,
    };
  }
  
  return body;
}

/**
 * Fetch with CSRF token automatically included
 */
export async function fetchWithCsrf(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getCsrfToken();
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('X-CSRF-Token', token);
  }
  
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Important for cookies
  });
}

