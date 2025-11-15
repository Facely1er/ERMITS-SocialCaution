import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/common/ErrorBoundary';
import EnhancedErrorBoundary from './components/common/EnhancedErrorBoundary';
import { AuthProvider } from './components/auth/AuthProvider';
import { ThemeProvider } from './contexts/ThemeContext';
import { PersonaProvider } from './core/providers/PersonaProvider';
import { ToastProvider } from './components/common/ToastProvider';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProductionChecklist from './components/common/ProductionChecklist';
import PerformanceMonitor from './components/common/PerformanceMonitor';

// Eagerly loaded core components
import HomePage from './pages/HomePage';

// Lazily loaded page components grouped by feature
// Assessment related pages
const AssessmentPage = lazy(() => import('./pages/AssessmentPage'));
const ExposureAssessmentPage = lazy(() => import('./pages/assessment/ExposureAssessmentPage'));
const PrivacyRightsAssessmentPage = lazy(() => import('./pages/assessment/PrivacyRightsAssessmentPage'));
const SecurityAssessmentPage = lazy(() => import('./pages/assessment/SecurityAssessmentPage'));
const AssessmentResultsPage = lazy(() => import('./pages/assessment/AssessmentResultsPage'));

// Core pages
const AboutPage = lazy(() => import('./pages/AboutPage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const HelpCenterPage = lazy(() => import('./pages/HelpCenterPage'));
const PrivacyFocusPage = lazy(() => import('./pages/PrivacyFocusPage'));

// Privacy journey related pages
const PrivacyActionCenterPage = lazy(() => import('./pages/PrivacyActionCenterPage'));
const PrivacyJourneyPage = lazy(() => import('./pages/PrivacyJourneyPage'));
const ThirtyDayRoadmapPage = lazy(() => import('./pages/ThirtyDayRoadmapPage'));
// PersonasPage is not used in current routing - using PersonaSelectionPage instead
// const PersonasPage = lazy(() => import('./pages/PersonasPage'));
const PersonaSelectionPage = lazy(() => import('./pages/PersonaSelectionPage'));

// Persona pages
const CautiousParentPage = lazy(() => import('./pages/personas/CautiousParentPage'));
const PrivateIndividualPage = lazy(() => import('./pages/personas/PrivateIndividualPage'));
const OnlineShopperPage = lazy(() => import('./pages/personas/OnlineShopperPage'));
const SocialInfluencerPage = lazy(() => import('./pages/personas/SocialInfluencerPage'));
const DigitalNovicePage = lazy(() => import('./pages/personas/DigitalNovicePage'));
const PrivacyAdvocatePage = lazy(() => import('./pages/personas/PrivacyAdvocatePage'));
const EmployeePersonaPage = lazy(() => import('./pages/personas/EmployeePersonaPage'));

// Help pages
const ActionPlanTutorial = lazy(() => import('./pages/help/ActionPlanTutorial'));

// Test pages
const TestAssessmentPage = lazy(() => import('./pages/TestAssessmentPage'));
const GettingStartedGuide = lazy(() => import('./pages/help/GettingStartedGuide'));

// Resources related pages
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const GuidesPage = lazy(() => import('./pages/resources/GuidesPage'));
const ChecklistsPage = lazy(() => import('./pages/resources/ChecklistsPage'));
const ToolsPage = lazy(() => import('./pages/resources/ToolsPage'));
// List pages are not used in current routing
// const GuidesListPage = lazy(() => import('./pages/resources/GuidesListPage'));
// const ChecklistsListPage = lazy(() => import('./pages/resources/ChecklistsListPage'));
// const ToolsListPage = lazy(() => import('./pages/resources/ToolsListPage'));
const ResourceGuidePage = lazy(() => import('./pages/ResourceGuidePage'));
const ToolkitPage = lazy(() => import('./pages/ToolkitPage'));

// Blog related pages
const BlogPage = lazy(() => import('./pages/BlogPage'));
const PrivacyImportanceBlogPost = lazy(() => import('./pages/blog/PrivacyImportanceBlogPost'));
const DataProtectionLawsBlogPost = lazy(() => import('./pages/blog/DataProtectionLawsBlogPost'));
const PrivacyToolsSocialMediaBlogPost = lazy(() => import('./pages/blog/PrivacyToolsSocialMediaBlogPost'));
const ChildrenPrivacyProtectionBlogPost = lazy(() => import('./pages/blog/ChildrenPrivacyProtectionBlogPost'));
const HiddenCostFreeBlogPost = lazy(() => import('./pages/blog/HiddenCostFreeBlogPost'));
const PrivacyBrowsersComparisonBlogPost = lazy(() => import('./pages/blog/PrivacyBrowsersComparisonBlogPost'));
const PrivacyLawsBlogPost = lazy(() => import('./pages/blog/PrivacyLawsBlogPost'));
const WorkplacePrivacyBlogPost = lazy(() => import('./pages/blog/WorkplacePrivacyBlogPost'));

// Legal related pages
const PrivacyLawsPage = lazy(() => import('./pages/legal/PrivacyLawsPage'));
const GDPRPage = lazy(() => import('./pages/legal/GDPRPage'));
const GlobalPrivacyActPage = lazy(() => import('./pages/legal/GlobalPrivacyActPage'));
const USPrivacyPage = lazy(() => import('./pages/legal/USPrivacyPage'));
const EnforcementPage = lazy(() => import('./pages/legal/EnforcementPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/legal/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/legal/TermsPage'));
const CookiePolicyPage = lazy(() => import('./pages/legal/CookiePolicyPage'));
const AcceptableUsePolicyPage = lazy(() => import('./pages/legal/AcceptableUsePolicyPage'));

// Dashboard related pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DashboardHomePage = lazy(() => import('./pages/dashboard/ModernDashboardHomePage'));
const ActionPlanPage = lazy(() => import('./pages/dashboard/ActionPlanPage'));
const HistoryPage = lazy(() => import('./pages/dashboard/HistoryPage'));
const ExposureCheckDashboardPage = lazy(() => import('./pages/dashboard/ExposureCheckDashboardPage'));
const RightsCheckupDashboardPage = lazy(() => import('./pages/dashboard/RightsCheckupDashboardPage'));
const CompleteAssessmentDashboardPage = lazy(() => import('./pages/dashboard/CompleteAssessmentDashboardPage'));
const ProfilePage = lazy(() => import('./pages/dashboard/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage'));
const HelpPage = lazy(() => import('./pages/dashboard/HelpPage'));
const NotificationsPage = lazy(() => import('./pages/dashboard/NotificationsPage'));

// Privacy tools
const DigitalFootprintAnalyzer = lazy(() => import('./pages/tools/DigitalFootprintAnalyzer'));
const CookieTrackerScanner = lazy(() => import('./pages/tools/CookieTrackerScanner'));
const PrivacyAssessmentTool = lazy(() => import('./pages/tools/PrivacyAssessmentTool'));
const DataBrokerRemovalTool = lazy(() => import('./pages/tools/DataBrokerRemovalTool'));
const PrivacySimulator = lazy(() => import('./pages/tools/PrivacySimulator'));
const PersonalDataInventory = lazy(() => import('./pages/tools/PersonalDataInventory'));
const PasswordStrengthChecker = lazy(() => import('./pages/tools/PasswordStrengthChecker'));

// Loading spinner component for Suspense fallback
const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-gray-600 dark:text-gray-400" aria-live="polite" role="status">
        Loading...
      </p>
    </div>
  </div>
);

// Create router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
                      {/* Main Routes - Home page loaded eagerly for fast initial render */}
                      <Route path="/" element={<HomePage />} />
                      
                      {/* Core pages */}
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/features" element={<FeaturesPage />} />
                      <Route path="/how-it-works" element={<HowItWorksPage />} />
                      <Route path="/help" element={<HelpCenterPage />} />
                      <Route path="/help/action-plan" element={<ActionPlanTutorial />} />
                      <Route path="/help/getting-started" element={<GettingStartedGuide />} />
                      <Route path="/toolkit" element={<ToolkitPage />} />
                      <Route path="/resources" element={<ResourcesPage />} />
                      <Route path="/privacy-journey" element={<PrivacyJourneyPage />} />
                      <Route path="/30-day-roadmap" element={<ThirtyDayRoadmapPage />} />
                      
                      {/* Privacy Focus and Personas */}
                      <Route path="/privacy-focus" element={<PrivacyFocusPage />} />
                      <Route path="/personas" element={<PersonaSelectionPage />} />
                      <Route path="/personas/cautious-parent" element={<CautiousParentPage />} />
                      <Route path="/personas/private-individual" element={<PrivateIndividualPage />} />
                      <Route path="/personas/online-shopper" element={<OnlineShopperPage />} />
                      <Route path="/personas/social-influencer" element={<SocialInfluencerPage />} />
                      <Route path="/personas/digital-novice" element={<DigitalNovicePage />} />
                      <Route path="/personas/privacy-advocate" element={<PrivacyAdvocatePage />} />
                      <Route path="/personas/concerned-employee" element={<EmployeePersonaPage />} />
                      
                      {/* Assessment Routes */}
                      <Route path="/assessment" element={<AssessmentPage />} />
                      <Route path="/assessment/exposure" element={<ExposureAssessmentPage />} />
                      <Route path="/assessment/rights" element={<PrivacyRightsAssessmentPage />} />
                      <Route path="/assessment/security" element={<SecurityAssessmentPage />} />
                      <Route path="/assessment/results" element={<AssessmentResultsPage />} />
                      
                      {/* Test Routes */}
                      <Route path="/test-assessment" element={<TestAssessmentPage />} />
                      
                      {/* Privacy Action Center */}
                      <Route path="/privacy-action-center" element={<PrivacyActionCenterPage />} />
                      
                      {/* Resources Routes */}
                      <Route path="/resources/guides" element={<GuidesPage />} />
                      <Route path="/resources/guides/:guideId" element={<ResourceGuidePage type="guide" />} />
                      <Route path="/resources/checklists" element={<ChecklistsPage />} />
                      <Route path="/resources/checklists/:checklistId" element={<ResourceGuidePage type="checklist" />} />
                      <Route path="/resources/tools" element={<ToolsPage />} />
                      <Route path="/resources/tools/digital-footprint" element={<DigitalFootprintAnalyzer />} />
                      <Route path="/resources/tools/cookie-tracker" element={<CookieTrackerScanner />} />
                      <Route path="/resources/tools/privacy-assessment" element={<PrivacyAssessmentTool />} />
                      <Route path="/resources/tools/data-broker-removal" element={<DataBrokerRemovalTool />} />
                      <Route path="/resources/tools/privacy-simulator" element={<PrivacySimulator />} />
                      <Route path="/resources/tools/personal-data-inventory" element={<PersonalDataInventory />} />
                      <Route path="/resources/tools/password-strength" element={<PasswordStrengthChecker />} />
                      
                      {/* Blog Routes */}
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/blog/privacy-importance" element={<PrivacyImportanceBlogPost />} />
                      <Route path="/blog/data-protection-laws-2024" element={<DataProtectionLawsBlogPost />} />
                      <Route path="/blog/privacy-tools-social-media" element={<PrivacyToolsSocialMediaBlogPost />} />
                      <Route path="/blog/children-privacy-protection" element={<ChildrenPrivacyProtectionBlogPost />} />
                      <Route path="/blog/hidden-cost-free-services" element={<HiddenCostFreeBlogPost />} />
                      <Route path="/blog/privacy-browsers-comparison" element={<PrivacyBrowsersComparisonBlogPost />} />
                      <Route path="/blog/privacy-laws-2025" element={<PrivacyLawsBlogPost />} />
                      <Route path="/blog/workplace-privacy" element={<WorkplacePrivacyBlogPost />} />
                      
                      {/* Dashboard Routes */}
                      <Route path="/dashboard" element={<DashboardPage />}>
                        <Route index element={<DashboardHomePage />} />
                        <Route path="action-plan" element={<ActionPlanPage />} />
                        <Route path="history" element={<HistoryPage />} />
                        <Route path="exposure-check" element={<ExposureCheckDashboardPage />} />
                        <Route path="rights-checkup" element={<RightsCheckupDashboardPage />} />
                        <Route path="complete-assessment" element={<CompleteAssessmentDashboardPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="notifications" element={<NotificationsPage />} />
                        <Route path="help" element={<HelpPage />} />
                      </Route>
                      
                      {/* Legal Routes */}
                      <Route path="/privacy-laws" element={<PrivacyLawsPage />} />
                      <Route path="/privacy-laws/gdpr" element={<GDPRPage />} />
                      <Route path="/privacy-laws/global-privacy-act" element={<GlobalPrivacyActPage />} />
                      <Route path="/privacy-laws/us-privacy" element={<USPrivacyPage />} />
                      <Route path="/privacy-laws/enforcement" element={<EnforcementPage />} />
                          <Route path="/privacy" element={<PrivacyPolicyPage />} />
                          <Route path="/terms" element={<TermsPage />} />
                          <Route path="/cookies" element={<CookiePolicyPage />} />
                          <Route path="/acceptable-use" element={<AcceptableUsePolicyPage />} />
                      
                      {/* Additional Routes */}
                      <Route path="/pricing" element={<PricingPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      
                      {/* 404 and Catch-all */}
                      <Route path="/404" element={<NotFoundPage />} />
                      <Route path="*" element={<Navigate to="/404" replace />} />
                    </Route>
  )
);

function App() {
  // App initialization (removed console.log for production)

  return (
    <EnhancedErrorBoundary>
      <ErrorBoundary>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <PersonaProvider>
                {import.meta.env.DEV && (
                  <>
                    <ProductionChecklist />
                    <PerformanceMonitor />
                  </>
                )}
                <Suspense fallback={<SuspenseFallback />}>
                  <RouterProvider router={router} />
                </Suspense>
              </PersonaProvider> 
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </EnhancedErrorBoundary>
  );
}

export default App;