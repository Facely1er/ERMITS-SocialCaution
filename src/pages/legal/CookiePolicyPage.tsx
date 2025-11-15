import PageLayout from '../../components/layout/PageLayout';
import Section from '../../components/common/Section';
import Card from '../../components/common/Card';

const CookiePolicyPage = () => {
  return (
    <PageLayout
      title="Cookie Policy"
      subtitle="How we use cookies and similar technologies on our website"
      heroBackground={false}
      backgroundType="privacy"
      breadcrumbs={[
        { label: 'Legal', path: '/legal' },
        { label: 'Cookie Policy', path: '/cookies' }
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
              This Cookie Policy explains how ERMITS LLC ("ERMITS," "we," "our," or "us") uses cookies and similar technologies when you use our Services. This policy should be read in conjunction with our Privacy Policy.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. What Are Cookies?</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">1.1 Definition</h3>
            <p>
              Cookies are small text files stored on your device (computer, tablet, smartphone) when you visit websites or use applications. Cookies enable websites to remember your actions and preferences over time.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">1.2 Similar Technologies</h3>
            <p>This policy also covers similar technologies including:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Local Storage:</strong> Browser-based storage (localStorage, IndexedDB)</li>
              <li><strong>Session Storage:</strong> Temporary storage cleared when browser closes</li>
              <li><strong>Web Beacons (Pixels):</strong> Small graphics that track page views</li>
              <li><strong>SDKs:</strong> Software development kits for mobile applications</li>
              <li><strong>Fingerprinting:</strong> Device and browser characteristic collection</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Cookies</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Cookie Categories</h3>
            <p>We use the following categories of cookies:</p>

            <div className="bg-light-blue/10 dark:bg-light-blue/20 p-4 rounded-lg mt-4">
              <h4 className="font-semibold text-primary dark:text-white mb-2">Essential Cookies (Always Active):</h4>
              <p className="text-gray-700 dark:text-gray-300">Required for basic service functionality:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Authentication and session management</li>
                <li>Security and fraud prevention</li>
                <li>Load balancing and performance</li>
                <li>User preference storage (language, theme)</li>
              </ul>
            </div>

            <div className="bg-light-blue/10 dark:bg-light-blue/20 p-4 rounded-lg mt-4">
              <h4 className="font-semibold text-primary dark:text-white mb-2">Performance Cookies (Optional):</h4>
              <p className="text-gray-700 dark:text-gray-300">Help us improve service performance:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Page load time measurement</li>
                <li>Error tracking and debugging (Sentry)</li>
                <li>Feature usage analytics</li>
                <li>Service optimization</li>
              </ul>
            </div>

            <div className="bg-light-blue/10 dark:bg-light-blue/20 p-4 rounded-lg mt-4">
              <h4 className="font-semibold text-primary dark:text-white mb-2">Analytics Cookies (Optional):</h4>
              <p className="text-gray-700 dark:text-gray-300">Help us understand how Services are used:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                <li>User behavior patterns (PostHog with differential privacy)</li>
                <li>Popular features and pages</li>
                <li>User journey analysis</li>
                <li>Conversion tracking</li>
              </ul>
            </div>

            <div className="bg-light-blue/10 dark:bg-light-blue/20 p-4 rounded-lg mt-4">
              <h4 className="font-semibold text-primary dark:text-white mb-2">Functional Cookies (Optional):</h4>
              <p className="text-gray-700 dark:text-gray-300">Enable enhanced functionality:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                <li>Remember settings and preferences</li>
                <li>Personalize user experience</li>
                <li>Enable integrations with third-party services</li>
              </ul>
            </div>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Specific Cookies We Use</h2>

            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border border-gray-300 dark:border-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Cookie Name</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Provider</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Purpose</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Type</th>
                    <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>sb-access-token</strong></td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Supabase</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Authentication</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Essential</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">1 hour</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>sb-refresh-token</strong></td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Supabase</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Session renewal</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Essential</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">30 days</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>theme</strong></td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">ERMITS</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">UI theme preference (light/dark)</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Functional</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">1 year</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>language</strong></td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">ERMITS</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Language preference</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Functional</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">1 year</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>consent</strong></td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">ERMITS</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Cookie consent preferences</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Essential</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">1 year</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>phc_***</strong></td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">PostHog</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Anonymous analytics</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Analytics</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">1 year</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2"><strong>sentry-session</strong></td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Sentry</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Error tracking session</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Performance</td>
                    <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-4 text-sm italic">
              <strong>Note:</strong> Cookie names and specifics may change. This table represents typical cookies; actual implementation may vary by product.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Cookies</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Third-Party Service Providers</h3>
            <p>We use third-party services that may set cookies:</p>

            <div className="space-y-4 mt-4">
              <div className="bg-light-blue/10 dark:bg-light-blue/20 p-4 rounded-lg">
                <h4 className="font-semibold text-primary dark:text-white mb-2">Supabase (Authentication & Database):</h4>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                  <li><strong>Purpose:</strong> User authentication and session management</li>
                  <li><strong>Privacy:</strong> Essential for service functionality</li>
                  <li><strong>Control:</strong> Required for service use; cannot be disabled</li>
                  <li><strong>More info:</strong> https://supabase.com/privacy</li>
                </ul>
              </div>

              <div className="bg-light-blue/10 dark:bg-light-blue/20 p-4 rounded-lg">
                <h4 className="font-semibold text-primary dark:text-white mb-2">Sentry (Error Tracking):</h4>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                  <li><strong>Purpose:</strong> Monitor application errors and performance</li>
                  <li><strong>Privacy:</strong> Automatically scrubs PII from error reports</li>
                  <li><strong>Control:</strong> Can be disabled in privacy settings</li>
                  <li><strong>More info:</strong> https://sentry.io/privacy/</li>
                </ul>
              </div>

              <div className="bg-light-blue/10 dark:bg-light-blue/20 p-4 rounded-lg">
                <h4 className="font-semibold text-primary dark:text-white mb-2">PostHog (Analytics):</h4>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                  <li><strong>Purpose:</strong> Anonymous usage analytics with differential privacy</li>
                  <li><strong>Privacy:</strong> Cannot identify individual users</li>
                  <li><strong>Control:</strong> Can be disabled in privacy settings (opt-out)</li>
                  <li><strong>More info:</strong> https://posthog.com/privacy</li>
                </ul>
              </div>

              <div className="bg-light-blue/10 dark:bg-light-blue/20 p-4 rounded-lg">
                <h4 className="font-semibold text-primary dark:text-white mb-2">Stripe (Payment Processing):</h4>
                <ul className="list-disc ml-6 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
                  <li><strong>Purpose:</strong> Payment processing and fraud prevention</li>
                  <li><strong>Privacy:</strong> Handles payment information securely</li>
                  <li><strong>Control:</strong> Required for payment functionality</li>
                  <li><strong>More info:</strong> https://stripe.com/privacy</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Cookies and Privacy-First Architecture</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Minimal Cookie Use</h3>
            <p>Due to Privacy-First Architecture:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>No tracking cookies</strong> for advertising or marketing</li>
              <li><strong>No cross-site tracking</strong> or profiling</li>
              <li><strong>Minimal essential cookies</strong> only for functionality</li>
              <li><strong>Local processing</strong> reduces need for server-side cookies</li>
              <li><strong>Pseudonymized analytics</strong> cannot identify individual users</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Data Minimization</h3>
            <p>Cookies are designed to collect minimum data necessary:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>No PII in cookies</strong> (names, emails, addresses not stored in cookies)</li>
              <li><strong>Session tokens only</strong> for authentication</li>
              <li><strong>Hashed identifiers</strong> for analytics (cannot be reverse-engineered)</li>
              <li><strong>No sensitive data</strong> in cookies (passwords, financial info, CUI/FCI)</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Cookie Choices</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">6.1 Cookie Consent</h3>
            <p>When you first visit ERMITS Services:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Cookie Banner:</strong> You'll see a cookie consent banner</li>
              <li><strong>Granular Control:</strong> Choose which cookie categories to accept</li>
              <li><strong>Default Settings:</strong> Only essential cookies enabled by default</li>
              <li><strong>Change Anytime:</strong> Update preferences in Account Settings</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">6.2 Managing Cookie Preferences</h3>
            <p className="font-semibold">Within ERMITS Services:</p>
            <ul className="list-disc ml-8 mt-2 space-y-1">
              <li>Navigate to Account Settings → Privacy → Cookie Preferences</li>
              <li>Toggle categories on/off (except essential cookies)</li>
              <li>Save preferences (stored in essential consent cookie)</li>
            </ul>

            <p className="mt-4 font-semibold">Browser Controls:</p>
            <p className="ml-4">Most browsers allow cookie management:</p>
            <ul className="list-disc ml-8 mt-2 space-y-1">
              <li><strong>Block all cookies:</strong> May prevent service functionality</li>
              <li><strong>Block third-party cookies:</strong> Reduces tracking</li>
              <li><strong>Delete cookies:</strong> Clear existing cookies</li>
              <li><strong>Incognito/Private mode:</strong> Cookies deleted when browser closes</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Do Not Track (DNT)</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">7.1 DNT Support</h3>
            <p>ERMITS respects browser Do Not Track signals:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>DNT Enabled:</strong> We disable optional analytics and performance cookies</li>
              <li><strong>Essential Cookies Only:</strong> Authentication and security cookies remain active</li>
              <li><strong>No Tracking:</strong> No behavioral tracking when DNT is enabled</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Cookies and International Privacy Laws</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">8.1 GDPR Compliance (EU/UK/Swiss)</h3>
            <p>For users in the European Economic Area, United Kingdom, or Switzerland:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Consent Required:</strong> We obtain consent before setting non-essential cookies</li>
              <li><strong>Granular Control:</strong> You can accept/reject specific cookie categories</li>
              <li><strong>Easy Withdrawal:</strong> Withdraw consent anytime in Account Settings</li>
              <li><strong>Pre-Checked Boxes Prohibited:</strong> Cookie preferences start with only essential cookies enabled</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">8.2 CCPA Compliance (California)</h3>
            <p>For California residents:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>No Sale of Data:</strong> We do not sell personal information collected via cookies</li>
              <li><strong>Opt-Out Rights:</strong> You can disable optional cookies anytime</li>
              <li><strong>Disclosure:</strong> This policy discloses all cookies used</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Cookies and Security</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">9.1 Secure Cookie Practices</h3>
            <p>ERMITS implements secure cookie handling:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Secure Flag:</strong> Cookies transmitted only over HTTPS</li>
              <li><strong>HttpOnly Flag:</strong> Cookies inaccessible to JavaScript (prevents XSS attacks)</li>
              <li><strong>SameSite Attribute:</strong> Cookies sent only to same-site requests (prevents CSRF)</li>
              <li><strong>Encrypted Values:</strong> Sensitive cookie values are encrypted</li>
              <li><strong>Short Expiration:</strong> Session cookies expire quickly</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Local Storage and IndexedDB</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3">10.1 Privacy-First Local Storage</h3>
            <p>ERMITS products extensively use browser local storage (localStorage, IndexedDB) for Privacy-First Architecture:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Store assessment data locally (never transmitted to servers)</li>
              <li>Enable offline functionality</li>
              <li>Reduce server data storage</li>
              <li>Provide faster performance</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Information</h2>

            <p><strong>Cookie Policy Questions:</strong><br />
            Email: contact@ermits.com<br />
            Subject: "Cookie Policy Inquiry"</p>

            <p className="mt-4"><strong>Cookie Preferences:</strong><br />
            Account Settings → Privacy → Cookie Preferences</p>

            <p className="mt-4"><strong>Data Protection Officer (EU/UK/Swiss):</strong><br />
            Email: contact@ermits.com<br />
            Subject: "Cookie GDPR Inquiry"</p>

            <p className="mt-4"><strong>Technical Support:</strong><br />
            Email: contact@ermits.com</p>
          </div>
        </Card>
      </Section>
    </PageLayout>
  );
};

export default CookiePolicyPage;
