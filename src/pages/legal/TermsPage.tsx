import React from 'react';
import PageLayout from '../../components/layout/PageLayout';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';

const TermsPage = () => {
  return (
    <PageLayout
      title="Master Terms of Service"
      subtitle="Our commitment to providing secure and reliable privacy services"
      heroBackground={false}
      backgroundType="privacy"
      breadcrumbs={[
        { label: 'Legal', path: '/legal' },
        { label: 'Terms of Service', path: '/terms' }
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
              By accessing or using any ERMITS LLC ("ERMITS," "we," "our," or "us") products, platforms, or services (collectively, the "Services"), you ("User," "you," or "your") agree to be bound by these Master Terms of Service ("Terms"). If you do not agree to these Terms, do not use our Services.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Scope and Applicability</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">1.1 Scope</h3>
            <p>These Terms govern your use of all ERMITS products, including but not limited to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>TechnoSoluce™ Brand Products:</strong> SBOM Analyzer - Software supply chain security and vulnerability analysis</li>
              <li><strong>CyberCertitude™ Brand Products:</strong> CMMC 2.0 Level 1 Implementation Suite, CMMC 2.0 Level 2 Compliance Platform, Original Toolkit</li>
              <li><strong>VendorSoluce™ Brand Products:</strong> Supply Chain Risk Management Platform</li>
              <li><strong>CyberCorrect™ Brand Products:</strong> Privacy Portal (Workplace privacy compliance), Privacy Platform (Multi-regulation privacy compliance automation)</li>
              <li><strong>CyberCaution™ Brand Products:</strong> RansomCheck (Ransomware readiness assessment), Security Toolkit, RiskProfessional (CISA-aligned security assessments)</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">1.2 Definitions</h3>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>"Privacy-First Architecture"</strong> means ERMITS' system design philosophy ensuring that user data is processed locally whenever possible, with optional encrypted cloud synchronization, pseudonymized telemetry, and zero-knowledge data handling principles.</li>
              <li><strong>"User Data"</strong> means any information, content, files, or materials that you upload, submit, generate, or process through the Services.</li>
              <li><strong>"Controlled Unclassified Information" or "CUI"</strong> means information that requires safeguarding or dissemination controls pursuant to federal law, regulations, or government-wide policies.</li>
              <li><strong>"Federal Contract Information" or "FCI"</strong> means information not intended for public release that is provided by or generated for the U.S. Government under a contract.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Privacy-First Architecture and Data Handling</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Client-Side Processing</h3>
            <p>All core computational functions (assessments, SBOM analysis, risk scoring, compliance evaluations) are performed locally within your browser or self-managed environment whenever technically feasible.</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Data Sovereignty Options</h3>
            <p>You have multiple deployment and storage options:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Local Storage Options:</strong> Browser-based local storage (IndexedDB, localStorage), Desktop application with local file storage, On-premises deployment (Enterprise customers)</li>
              <li><strong>Cloud Storage Options:</strong> Self-managed cloud infrastructure, ERMITS-managed cloud (Supabase or alternative providers), Hybrid deployment (local processing with optional encrypted sync)</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">2.3 Zero-Knowledge Principles</h3>
            <p>When using ERMITS-managed cloud services with encryption enabled:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Data is encrypted client-side using AES-256-GCM via WebCrypto</li>
              <li>Encryption keys are derived from your credentials and never transmitted to ERMITS</li>
              <li>ERMITS administrators cannot decrypt your data</li>
              <li>You are solely responsible for maintaining access to your encryption keys</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. License Grant and Restrictions</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.1 License to Use Services</h3>
            <p>Subject to your compliance with these Terms, ERMITS grants you a limited, non-exclusive, non-transferable, revocable license to access and use the Services for your internal business or personal purposes.</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">3.2 License Restrictions</h3>
            <p>You may not:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information, software, products, or services obtained from the Services</li>
              <li>Reverse engineer, decompile, disassemble, or attempt to discover source code or underlying algorithms (except to the extent such restriction is prohibited by applicable law)</li>
              <li>Remove, obscure, or alter any proprietary rights notices</li>
              <li>Use the Services to develop competing products or services</li>
              <li>Access the Services through automated means (bots, scrapers) without prior written authorization</li>
              <li>Attempt to circumvent security measures or gain unauthorized access</li>
              <li>Use the Services in any way that violates applicable laws or regulations</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Data Ownership and Responsibilities</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">4.1 User Data Ownership</h3>
            <p>You retain all ownership rights in your User Data. ERMITS does not claim any ownership or intellectual property rights in your User Data.</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">4.2 User Data Responsibilities</h3>
            <p>You are solely responsible for:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>The accuracy, quality, and legality of your User Data</li>
              <li>The means by which you acquired User Data</li>
              <li>Compliance with all applicable laws regarding User Data processing</li>
              <li>Maintaining appropriate security controls for your User Data</li>
              <li>Backup and disaster recovery of locally-stored data</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Payment Terms</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Pricing and Billing</h3>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Pricing for Services is set forth on the ERMITS website or in your subscription agreement</li>
              <li>All fees are in U.S. Dollars unless otherwise specified</li>
              <li>Fees are non-refundable except as expressly provided in the Refund & Cancellation Policy</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Subscription Terms</h3>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>Renewal pricing may change with 30 days' notice</li>
              <li>Downgrades take effect at the next billing cycle</li>
              <li>Cancellations must be submitted before renewal date</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Term and Termination</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">6.1 Termination by You</h3>
            <p>You may terminate your account at any time through:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Account settings within the Services</li>
              <li>Contacting ERMITS support at contact@ermits.com</li>
              <li>Following product-specific cancellation procedures</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">6.2 Termination by ERMITS</h3>
            <p>ERMITS may suspend or terminate your access immediately without notice if:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>You breach these Terms or any applicable policies</li>
              <li>Your account is inactive for 12+ months (free accounts)</li>
              <li>Your payment method fails or account is delinquent</li>
              <li>Required by law or regulatory authority</li>
              <li>Necessary to protect ERMITS or other users</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Warranties and Disclaimers</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">7.1 Limited Warranty</h3>
            <p>ERMITS warrants that the Services will perform substantially in accordance with published documentation under normal use. This warranty does not apply to:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Beta Products or pre-release features</li>
              <li>Free tiers or trial accounts</li>
              <li>Issues caused by user error, misuse, or modifications</li>
              <li>Third-party services or integrations</li>
              <li>Force majeure events</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">7.2 Disclaimer of Warranties</h3>
            <p>EXCEPT AS EXPRESSLY PROVIDED, THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>No warranty that Services will meet your specific requirements</li>
              <li>No guarantee of continuous, error-free operation</li>
              <li>No guarantee that Services are completely secure or error-free</li>
              <li>No warranty regarding accuracy, completeness, or reliability of outputs</li>
              <li>No guarantee that use of Services will result in regulatory compliance or certification</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">7.3 Compliance Disclaimer</h3>
            <p>ERMITS products are tools to assist with security and compliance efforts but:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Do not guarantee compliance with any regulatory framework</li>
              <li>Do not constitute legal, compliance, or professional consulting advice</li>
              <li>Require users to interpret results in the context of their specific obligations</li>
              <li>Do not replace qualified security assessments or professional audits</li>
              <li>Are not certification authorities (not C3PAO, not CISA-endorsed)</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">8.1 Exclusion of Consequential Damages</h3>
            <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ERMITS LLC, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, use, goodwill, or other intangible losses</li>
              <li>Business interruption or lost business opportunities</li>
              <li>Regulatory fines, penalties, or compliance costs</li>
              <li>Cost of procurement of substitute services</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">8.2 Cap on Liability</h3>
            <p>ERMITS' TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THESE TERMS OR USE OF THE SERVICES SHALL NOT EXCEED THE GREATER OF:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>$100 USD, or</li>
              <li>The total amount paid by you to ERMITS in the 12 months preceding the claim</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Governing Law and Dispute Resolution</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">9.1 Governing Law</h3>
            <p>These Terms are governed by and construed in accordance with the laws of the District of Columbia, United States, without regard to conflict of law principles.</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">9.2 Binding Arbitration</h3>
            <p>Any dispute, controversy, or claim arising out of or relating to these Terms shall be resolved by binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Information</h2>

            <p>For questions, concerns, or notices regarding these Terms:</p>
            <p className="mt-4"><strong>ERMITS LLC</strong><br />
            Email: contact@ermits.com<br />
            Website: www.ermits.com</p>

            <p className="mt-4"><strong>Technical Support:</strong><br />
            Email: contact@ermits.com</p>

            <p className="mt-4"><strong>Privacy Inquiries:</strong><br />
            Email: contact@ermits.com</p>

            <p className="mt-4"><strong>Compliance and Legal Inquiries:</strong><br />
            Email: contact@ermits.com</p>
          </div>
        </Card>
      </Section>
    </PageLayout>
  );
};

export default TermsPage;
