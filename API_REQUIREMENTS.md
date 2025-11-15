# API Requirements for Social Caution Platform

This document lists all the APIs needed to enable real functionality in the tools.

## Required API Keys

To enable real functionality (instead of simulated data), you need to configure the following environment variables in your backend `.env` file:

### 1. **Have I Been Pwned (HIBP) API**
- **Environment Variable:** `HIBP_API_KEY`
- **Purpose:** Check if email addresses have been involved in data breaches
- **Used By:** 
  - Digital Footprint Analyzer (for email breach checks)
  - Data Breach Checker tool
- **Get API Key:** https://haveibeenpwned.com/API/Key
- **Pricing:** Free tier available (limited requests), paid plans available
- **API Endpoint:** `https://haveibeenpwned.com/api/v3/breachedaccount/{email}`

### 2. **Google Custom Search API**
- **Environment Variables:** 
  - `GOOGLE_SEARCH_API_KEY` (API Key)
  - `GOOGLE_CSE_ID` (Custom Search Engine ID)
- **Purpose:** 
  - Web searches for digital footprint analysis
  - Social media profile searches
  - Phone number searches
  - General web presence discovery
- **Used By:** Digital Footprint Analyzer
- **Get API Key:** https://developers.google.com/custom-search/v1/overview
- **Pricing:** Free tier: 100 queries/day, then $5 per 1,000 queries
- **API Endpoint:** `https://www.googleapis.com/customsearch/v1`

### 3. **Shodan API**
- **Environment Variable:** `SHODAN_API_KEY`
- **Purpose:** Search for domain/IP information, exposed services, and security issues
- **Used By:** Digital Footprint Analyzer (for domain analysis)
- **Get API Key:** https://account.shodan.io/
- **Pricing:** Free tier: 100 queries/month, paid plans start at $59/month
- **API Endpoint:** `https://api.shodan.io/shodan/host/{domain}`

### 4. **VirusTotal API**
- **Environment Variable:** `VIRUSTOTAL_API_KEY`
- **Purpose:** Check domain reputation and security status
- **Used By:** Digital Footprint Analyzer (for domain reputation checks)
- **Get API Key:** https://www.virustotal.com/gui/join-us
- **Pricing:** Free tier: 4 requests/minute, paid plans available
- **API Endpoint:** `https://www.virustotal.com/vtapi/v2/domain/report`

### 5. **Hunter.io API**
- **Environment Variable:** `HUNTER_API_KEY`
- **Purpose:** Email verification and email finder
- **Used By:** Digital Footprint Analyzer (for email analysis)
- **Get API Key:** https://hunter.io/api-documentation
- **Pricing:** Free tier: 25 searches/month, paid plans start at $49/month
- **API Endpoint:** `https://api.hunter.io/v2/email-verifier`

### 6. **Clearbit API**
- **Environment Variable:** `CLEARBIT_API_KEY`
- **Purpose:** Company information and enrichment
- **Used By:** Digital Footprint Analyzer (for domain/company analysis)
- **Get API Key:** https://clearbit.com/docs#authentication
- **Pricing:** Free tier: 50 requests/month, paid plans available
- **API Endpoint:** `https://company.clearbit.com/v2/companies/find`

## Optional APIs (for enhanced functionality)

These APIs are used indirectly or can enhance the tools:

### Social Media Search
- **Uses:** Google Custom Search API (via `site:` queries)
- **Platforms Searched:** Twitter, Instagram, Facebook, LinkedIn, GitHub, Reddit, YouTube, TikTok
- **Note:** Requires Google Custom Search API to be configured

### Phone Number Search
- **Uses:** Google Custom Search API
- **Note:** Requires Google Custom Search API to be configured

## Tools That Don't Require APIs

These tools use simulated/mock data for educational purposes:
- **Personal Data Inventory** - Uses mock data for demonstration
- **Cookie Tracker Scanner** - Uses simulated examples for learning
- **Privacy Simulator** - Uses mock data for demonstration

## Setup Instructions

1. **Create a `.env` file** in the `backend` directory (if it doesn't exist)

2. **Add the API keys** to your `.env` file:
```env
# Digital Footprint & Privacy Tools APIs
HIBP_API_KEY=your_hibp_api_key_here
GOOGLE_SEARCH_API_KEY=your_google_api_key_here
GOOGLE_CSE_ID=your_google_cse_id_here
SHODAN_API_KEY=your_shodan_api_key_here
VIRUSTOTAL_API_KEY=your_virustotal_api_key_here
HUNTER_API_KEY=your_hunter_api_key_here
CLEARBIT_API_KEY=your_clearbit_api_key_here
```

3. **Restart your backend server** for the changes to take effect

4. **Verify the APIs are working** by checking the backend logs - you should see API calls instead of "API not configured" warnings

## Cost Estimates

### Minimum Setup (Free Tiers)
- **Have I Been Pwned:** Free (limited)
- **Google Custom Search:** Free (100 queries/day)
- **Shodan:** Free (100 queries/month)
- **VirusTotal:** Free (4 requests/minute)
- **Hunter.io:** Free (25 searches/month)
- **Clearbit:** Free (50 requests/month)

**Total:** $0/month (with usage limits)

### Recommended Setup (Paid Tiers)
- **Have I Been Pwned:** $3.50/month
- **Google Custom Search:** ~$5-20/month (depending on usage)
- **Shodan:** $59/month
- **VirusTotal:** $50/month
- **Hunter.io:** $49/month
- **Clearbit:** $99/month

**Total:** ~$265/month (for production use)

## Priority APIs

If you want to enable functionality gradually, prioritize in this order:

1. **Have I Been Pwned** - Most important for data breach checking
2. **Google Custom Search** - Enables multiple features (web search, social media, phone)
3. **Hunter.io** - Email verification and enrichment
4. **VirusTotal** - Domain security checks
5. **Shodan** - Advanced domain/IP analysis
6. **Clearbit** - Company information (nice to have)

## Notes

- All APIs have free tiers that are suitable for development and testing
- The system gracefully falls back to mock data if APIs are not configured
- API rate limits are respected by the implementation
- Error handling ensures the application continues to work even if APIs fail

