import React from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';

const PrivacyPolicyPage = () => {
  return (
    <PageLayout
      title="Master Privacy Policy"
      subtitle="How we protect and handle your personal information"
      heroBackground={false}
      backgroundType="privacy"
      breadcrumbs={[
        { label: 'Legal', path: '/legal' },
        { label: 'Privacy Policy', path: '/privacy' }
      ]}
    >
      <Section>
        <Card className="max-w-4xl mx-auto p-8">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-gray-600 dark:text-gray-400">
              <strong>Effective Date:</strong> October 31, 2025<br />
              <strong>Last Updated:</strong> October 31, 2025
            </p>
            
            <p className="mt-4">
              ERMITS LLC ("ERMITS," "we," "our," or "us") is committed to protecting your privacy through a Privacy-First Architecture that ensures you maintain control over your data. This Privacy Policy explains how we collect, use, disclose, and safeguard information when you use our Services.
            </p>

            <p className="mt-4">
              By using our Services, you consent to the data practices described in this policy. If you do not agree with this Privacy Policy, please do not use our Services.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Privacy-First Architecture Overview</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">1.1 Core Principles</h3>
            <p>ERMITS implements Privacy-First Architecture built on five fundamental principles:</p>

            <p className="mt-4 font-semibold">1. Client-Side Processing</p>
            <p className="ml-4">
              All core computational functions (security assessments, SBOM analysis, risk scoring, compliance evaluations) are performed locally within your browser or self-managed environment whenever technically feasible. Your data remains under your control throughout the analysis process.
            </p>

            <p className="mt-4 font-semibold">2. Data Sovereignty Options</p>
            <p className="ml-4">You choose where your data resides:</p>
            <ul className="list-disc ml-8 mt-2 space-y-1">
              <li><strong>Local-Only Mode:</strong> All data stored exclusively in your browser or desktop application</li>
              <li><strong>Self-Managed Cloud:</strong> Deploy to your own cloud infrastructure with full control</li>
              <li><strong>ERMITS-Managed Cloud:</strong> Optional encrypted cloud synchronization with zero-knowledge architecture</li>
              <li><strong>Hybrid Deployment:</strong> Local processing with selective encrypted cloud backup</li>
            </ul>

            <p className="mt-4 font-semibold">3. Zero-Knowledge Encryption</p>
            <p className="ml-4">When using ERMITS-managed cloud features with encryption enabled:</p>
            <ul className="list-disc ml-8 mt-2 space-y-1">
              <li>Data is encrypted client-side using AES-256-GCM before transmission</li>
              <li>Encryption keys are derived from your credentials and never transmitted to ERMITS</li>
              <li>ERMITS cannot decrypt, access, or view your encrypted data</li>
              <li>You are solely responsible for maintaining access to encryption keys</li>
            </ul>

            <p className="mt-4 font-semibold">4. Data Minimization</p>
            <p className="ml-4">We collect only the minimum data necessary for service functionality:</p>
            <ul className="list-disc ml-8 mt-2 space-y-1">
              <li><strong>Never Collected:</strong> Raw SBOM files, assessment content, CUI, FCI, vulnerability findings, compliance data, or proprietary business information</li>
              <li><strong>Pseudonymized Telemetry:</strong> Optional, anonymous performance metrics using irreversible cryptographic hashing</li>
              <li><strong>Account Data:</strong> Only when you create an account (name, email, company for authentication and billing)</li>
            </ul>

            <p className="mt-4 font-semibold">5. Transparency and Control</p>
            <p className="ml-4">You have complete control over your data:</p>
            <ul className="list-disc ml-8 mt-2 space-y-1">
              <li>Export all data at any time in standard formats (JSON, CSV, PDF)</li>
              <li>Delete all data permanently with one click</li>
              <li>Opt in or opt out of telemetry collection</li>
              <li>Choose your deployment and storage model</li>
              <li>Review detailed data flow documentation</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Information You Provide Directly</h3>
            <p className="font-semibold">Account Information (Optional):</p>
            <p className="ml-4">When you create an account or subscribe to paid features, we collect:</p>
            <ul className="list-disc ml-8 mt-2 space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Company name and job title (optional)</li>
              <li>Billing information (processed by Stripe, not stored by ERMITS)</li>
              <li>Password (cryptographically hashed, never stored in plaintext)</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Information We Do NOT Collect</h3>
            <p>ERMITS explicitly does NOT collect, access, store, or transmit:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>SBOM Data:</strong> Software bill of materials files, component lists, dependency graphs, or package metadata</li>
              <li><strong>Assessment Content:</strong> Security assessments, compliance evaluations, risk analyses, or audit findings</li>
              <li><strong>Vulnerability Data:</strong> Vulnerability scan results, CVE findings, or remediation plans</li>
              <li><strong>Compliance Data:</strong> CMMC documentation, POAMs, SSPs, evidence portfolios, or certification materials</li>
              <li><strong>Proprietary Business Data:</strong> Trade secrets, confidential information, or business-sensitive data</li>
              <li><strong>CUI/FCI:</strong> Controlled Unclassified Information or Federal Contract Information</li>
              <li><strong>Personal Health Information (PHI):</strong> Protected health information under HIPAA</li>
              <li><strong>Financial Records:</strong> Detailed financial data or payment card information (except via Stripe)</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">2.3 Automatically Collected Information</h3>
            <p className="font-semibold">Pseudonymized Telemetry (Optional):</p>
            <p className="ml-4">With your consent, we collect anonymous, aggregated performance data:</p>
            <ul className="list-disc ml-8 mt-2 space-y-1">
              <li>Feature usage statistics (which tools are used, how often)</li>
              <li>Performance metrics (page load times, API response times)</li>
              <li>Error reports (crash logs, exceptions) with PII automatically scrubbed by Sentry</li>
              <li>Browser and device information (browser type, OS version, screen resolution)</li>
              <li>Session metadata (session duration, navigation paths)</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Information</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Service Delivery and Operation</h3>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Provide, maintain, and improve the Services</li>
              <li>Process transactions and send transaction confirmations</li>
              <li>Authenticate users and maintain account security</li>
              <li>Enable features like cloud synchronization and multi-device access</li>
              <li>Provide customer support and respond to inquiries</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Service Improvement and Analytics</h3>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Analyze pseudonymized usage patterns to improve features</li>
              <li>Identify and fix bugs, errors, and performance issues</li>
              <li>Develop new features and services</li>
              <li>Conduct research and analysis (using only aggregated, anonymous data)</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.6 What We Do NOT Do</h3>
            <p>ERMITS does NOT:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Sell or rent your personal information to third parties</li>
              <li>Use your data for advertising or marketing to others</li>
              <li>Share your User Data with third parties (except as disclosed in Section 2.4)</li>
              <li>Train AI models on your User Data</li>
              <li>Analyze your assessment results or SBOM data for any purpose</li>
              <li>Profile users for behavioral targeting</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Information Sharing and Disclosure</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Service Providers (Sub-Processors)</h3>
            <p>We share limited data with trusted third-party service providers who assist in delivering the Services:</p>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border border-gray-300 dark:border-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Service Provider</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Purpose</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Data Shared</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Location</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>Supabase</strong></td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Database and authentication</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Email, encrypted user data (if cloud sync enabled)</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">United States</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>Stripe</strong></td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Payment processing</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Email, billing information</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">United States</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>Sentry</strong></td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Error monitoring</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Error logs with PII automatically scrubbed</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">United States</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>PostHog</strong></td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Analytics</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Pseudonymized usage metrics with differential privacy</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">United States / EU</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>Vercel</strong></td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Hosting and CDN</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">IP address, HTTP headers (standard web traffic)</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Global CDN</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security Measures</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Encryption</h3>
            <p className="font-semibold">Data in Transit:</p>
            <ul className="list-disc ml-8 mt-2 space-y-1">
              <li>TLS 1.3 encryption for all data transmission</li>
              <li>HTTPS required for all web traffic</li>
              <li>Certificate pinning for critical connections</li>
              <li>Perfect Forward Secrecy (PFS) enabled</li>
            </ul>

            <p className="mt-4 font-semibold">Data at Rest:</p>
            <ul className="list-disc ml-8 mt-2 space-y-1">
              <li>AES-256-GCM encryption for cloud-stored data</li>
              <li>Client-side encryption with user-controlled keys (zero-knowledge architecture)</li>
              <li>Encrypted database backups</li>
              <li>Secure key management practices</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Privacy Rights</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">6.1 Universal Rights</h3>
            <p>All users have the following rights regardless of location:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Right to Access:</strong> Request a copy of all personal data we hold about you</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete personal data</li>
              <li><strong>Right to Deletion (Right to be Forgotten):</strong> Request deletion of your personal data</li>
              <li><strong>Right to Data Portability:</strong> Export your data in machine-readable formats (JSON, CSV)</li>
              <li><strong>Right to Restriction of Processing:</strong> Request limitation of processing in certain circumstances</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">6.2 Additional Rights for EU/UK/Swiss Users (GDPR/UK GDPR/Swiss DPA)</h3>
            <p>If you are located in the European Economic Area, United Kingdom, or Switzerland, you have additional rights:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time (does not affect prior processing)</li>
              <li><strong>Right to Lodge a Complaint:</strong> File complaint with your local data protection authority</li>
              <li><strong>Right to Automated Decision-Making:</strong> ERMITS does not engage in automated decision-making with legal or significant effects</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">6.3 Additional Rights for California Residents (CCPA/CPRA)</h3>
            <p>If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Right to Know:</strong> Request categories and specific pieces of personal information collected</li>
              <li><strong>Right to Delete:</strong> Request deletion of personal information (subject to legal exceptions)</li>
              <li><strong>Right to Opt-Out of Sale:</strong> ERMITS does not sell personal information</li>
              <li><strong>Right to Non-Discrimination:</strong> Equal service and pricing regardless of privacy rights exercise</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Information</h2>

            <p><strong>Privacy Inquiries:</strong><br />
            Email: contact@ermits.com<br />
            Subject: "Privacy Inquiry"</p>

            <p className="mt-4"><strong>Data Rights Requests:</strong><br />
            Email: contact@ermits.com<br />
            Subject: "Privacy Rights Request"</p>

            <p className="mt-4"><strong>Data Protection Officer (EU/UK/Swiss):</strong><br />
            Email: contact@ermits.com<br />
            Subject: "GDPR Inquiry"</p>

            <p className="mt-4"><strong>California Privacy Requests:</strong><br />
            Email: contact@ermits.com<br />
            Subject: "CCPA Request"</p>

            <p className="mt-4"><strong>Security Concerns:</strong><br />
            Email: contact@ermits.com<br />
            Subject: "Security Issue"</p>

            <p className="mt-4"><strong>General Inquiries:</strong><br />
            Email: contact@ermits.com<br />
            Website: www.ermits.com</p>
          </div>
        </Card>
      </Section>
    </PageLayout>
  );
};

export default PrivacyPolicyPage;
