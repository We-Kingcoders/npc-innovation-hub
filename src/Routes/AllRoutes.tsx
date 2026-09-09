// src/Routes/AllRoutes.tsx
//
// Every route element below is lazy-loaded (React.lazy + Suspense), so a
// visitor only downloads the code for the page they're actually on instead
// of the whole app - the entire admin dashboard (recharts included),
// member dashboard, and every other page used to ship in one ~1.45MB/
// 383KB-gzip bundle on the very first request, homepage included. Footer,
// Navbar, and the two route guards stay eager: they render on (almost)
// every route, so lazy-loading them would just add a loading flicker for
// no bundle-size benefit.

import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "../components/button/Footer";
import Navbar from "../components/Navbar";
import { ProtectedRoute, PublicRoute } from "../components/ProtectedRoute";

const LoginPage = lazy(() => import("../pages/Login/LoginPage"));
const HubMembersSection = lazy(
  () => import("../pages/landing/HubMembersSection"),
);
const TeamCaptain = lazy(() => import("../pages/landing/TeamCaptain"));
const HeroSection = lazy(() => import("../pages/landing/HeroSection"));
const HubIntroVideo = lazy(() => import("../pages/landing/HubIntroVideo"));
const AlumniSection = lazy(() => import("../pages/landing/AlumniSection"));
const SignUpPage = lazy(() => import("../pages/Login/SignUp"));
const ProjectsPage = lazy(() => import("../pages/project-page/ProjectsPage"));
const ProjectsShowcase = lazy(
  () => import("../pages/landing/ProjectsShowcase"),
);
const InnovationHubMembersPage = lazy(() =>
  import("../pages/all-member-page/InnovationHubMembersPage").then((m) => ({
    default: m.InnovationHubMembersPage,
  })),
);
const MemberDetailPage = lazy(() =>
  import("../pages/all-member-page/MemberDetailPage").then((m) => ({
    default: m.MemberDetailPage,
  })),
);
const ApplyPage = lazy(() =>
  import("../pages/apply/ApplyPage").then((m) => ({ default: m.ApplyPage })),
);
const LetTalk = lazy(() => import("../pages/HireUs/form"));
const Partners = lazy(() => import("../pages/HireUs/partners"));
const Services = lazy(() => import("../pages/HireUs/services"));
const LatestPro = lazy(() => import("../pages/HireUs/latespro"));
const InnovationHub = lazy(() => import("../pages/HireUs/FirstSection"));
const BlogDesign = lazy(() => import("../pages/AboutHub/Topics"));
const BlogDetails = lazy(() => import("../pages/blog/BlogDetails"));
const MissionSection = lazy(() => import("../pages/Hub-info/MissionSection"));
const WhyHub = lazy(() => import("../pages/Hub-info/WhyHub"));
const FAQs = lazy(() => import("../pages/Hub-info/FAQs"));
const SupportCard = lazy(() => import("../pages/Hub-info/Support"));
const ChatCard = lazy(() => import("../pages/Hub-info/Help"));

// Resources Room
const Home = lazy(() => import("../pages/resources-room/Home"));
const Categories = lazy(() => import("../pages/resources-room/Categories"));
const SubcategoryResults = lazy(
  () => import("../pages/resources-room/SubcategoryResults"),
);
const AllResources = lazy(() => import("../pages/resources-room/AllResources"));

// Member Dashboard
const DashboardLayout = lazy(() =>
  import("../components/member/layouts/DashboardLayout").then((m) => ({
    default: m.DashboardLayout,
  })),
);
const Dashboard = lazy(() =>
  import("../pages/member-page/Dashboard").then((m) => ({
    default: m.Dashboard,
  })),
);
const Resources = lazy(() =>
  import("../pages/resources-page/Resources").then((m) => ({
    default: m.Resources,
  })),
);
const Projects = lazy(() =>
  import("../pages/projects-page/Projects").then((m) => ({
    default: m.Projects,
  })),
);
const AddProject = lazy(() => import("../pages/add-project-page/AddProject"));
const Events = lazy(() =>
  import("../pages/events-page/Events").then((m) => ({
    default: m.Events,
  })),
);
const Messages = lazy(() =>
  import("../pages/messages-page/Messages").then((m) => ({
    default: m.Messages,
  })),
);
const HubChannel = lazy(() =>
  import("../pages/messages-page/HubChannel").then((m) => ({
    default: m.HubChannel,
  })),
);
const MemberForm = lazy(() => import("../components/member/MemberForm"));
const MyTasks = lazy(() => import("../pages/tasks/MyTasks"));
const TaskDetails = lazy(() => import("../pages/tasks/TaskDetails"));
const ProfilePage = lazy(() => import("../pages/profile/ProfilePage"));

// Admin pages
const AdminDashboard = lazy(
  () => import("../pages/Admin-pages/AdminDashboard"),
);
const AdminResources = lazy(
  () => import("../pages/Admin-pages/AdminResources"),
);
const HireUsRequests = lazy(
  () => import("../pages/Admin-pages/HireUsRequests"),
);
const AddResource = lazy(() => import("../pages/Admin-pages/AddResource"));
const MemberManagement = lazy(
  () => import("../pages/Admin-pages/MemberManagement"),
);
const HeroMembersPage = lazy(
  () => import("../pages/Admin-pages/HeroMembersPage"),
);
const HubVideoPage = lazy(() => import("../pages/Admin-pages/HubVideoPage"));
const AlumniManagementPage = lazy(
  () => import("../pages/Admin-pages/AlumniManagementPage"),
);
const BlogTables = lazy(() => import("../pages/Admin-pages/BlogTables"));
const ProjectTables = lazy(() => import("../pages/Admin-pages/ProjectTables"));
const OTPVerification = lazy(() => import("../pages/Login/OTPVerification"));
const ForgotPassword = lazy(() => import("../pages/Login/ForgotPassword"));
const HireRequestDetail = lazy(
  () => import("../components/admin-components/HireRequestDetail"),
);
const ApplicationsPage = lazy(
  () => import("../pages/Admin-pages/ApplicationsPage"),
);
const ApplicationDetail = lazy(
  () => import("../components/admin-components/ApplicationDetail"),
);
const EventTables = lazy(() => import("../pages/Admin-pages/EventTables"));
const TaskManagement = lazy(
  () => import("../pages/Admin-pages/TaskManagement"),
);
const ViewProfile = lazy(
  () => import("../pages/Admin-pages/Profile/ViewProfile"),
);
const ProfileSettings = lazy(
  () => import("../pages/Admin-pages/Profile/ProfileSettings"),
);

// Admin Chat pages
const AdminMessages = lazy(() => import("../pages/Admin-pages/AdminMessages"));
const AdminHubChannel = lazy(
  () => import("../pages/Admin-pages/AdminHubChannel"),
);
const AdminChatLayout = lazy(
  () => import("../components/admin-components/AdminChatLayout"),
);

// A minimal, brand-consistent loading state while a lazy route chunk
// downloads - shown only on the first visit to a given route (browser
// caches the chunk after that).
const RouteLoadingFallback: React.FC = () => (
  <div
    role="status"
    aria-label="Loading"
    className="min-h-screen w-full flex items-center justify-center bg-white"
  >
    <div
      className="w-10 h-10 rounded-full border-4 border-[#E2E8F0] border-t-[#002B56] animate-spin"
      aria-hidden="true"
    />
  </div>
);

const AllRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}

        <Route
          path="/"
          element={
            // One continuous story - Home -> About -> Members -> Projects ->
            // Footer - rather than the disconnected pages this used to be.
            // Navbar's Home/AboutHub/Members/Projects links scroll to these
            // sections by id when already on "/" (see Navbar.tsx). Members
            // and Projects here are previews with a "View all" link to the
            // full /members and /projects pages, which stay their own
            // routes for deep exploration - nothing was removed, just
            // introduced here too.
            <>
              <Navbar />
              <HeroSection />
              <section
                id="about"
                aria-label="About NPC Innovation Hub"
                className="scroll-mt-16 lg:scroll-mt-20 py-20 px-4 md:px-8 bg-white"
              >
                <div className="container mx-auto max-w-7xl">
                  <div className="text-center mb-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-[#002b56] mb-4">
                      About #OurHUB
                    </h2>
                    <p className="text-xl font-medium text-[#002b56]/80 max-w-3xl mx-auto">
                      A student-led innovation space equipping members with
                      practical skills in tech, entrepreneurship, and
                      problem-solving.
                    </p>
                  </div>
                  <MissionSection showCta />
                </div>
              </section>
              <HubMembersSection />
              <ProjectsShowcase />
              <HubIntroVideo />
              <AlumniSection />
              <TeamCaptain />
              <Footer />
            </>
          }
        />
        <Route
          path="/hire-us"
          element={
            <>
              <Navbar />
              <InnovationHub />
              <Services />
              <Partners />
              <LatestPro />
              <LetTalk />
              <Footer />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <>
                <Navbar />
                <SignUpPage />
              </>
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route path="/otp" element={<OTPVerification />} />
        <Route
          path="/projects"
          element={
            <>
              <Navbar />
              <ProjectsPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/members"
          element={
            <>
              <Navbar />
              <InnovationHubMembersPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/members/:id"
          element={
            <>
              <Navbar />
              <MemberDetailPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/apply"
          element={
            <>
              <Navbar />
              <ApplyPage />
              <Footer />
            </>
          }
        />

        {/* ── Blog routes ── */}
        <Route
          path="/blog"
          element={
            <>
              <Navbar />
              <BlogDesign />
              <Footer />
            </>
          }
        />
        <Route
          path="/blogs"
          element={
            <>
              <Navbar />
              <BlogDesign />
              <Footer />
            </>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <>
              <Navbar />
              <BlogDetails />
              <Footer />
            </>
          }
        />

        <Route
          path="/Hub-information"
          element={
            <>
              <Navbar />
              <MissionSection />
              <WhyHub />
              <FAQs />
              <SupportCard />
              <Footer />
            </>
          }
        />
        <Route
          path="/resources-room"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />
        <Route
          path="/resources-room/categories"
          element={
            <>
              <Navbar />
              <Categories />
              <Footer />
            </>
          }
        />
        <Route
          path="/resources-room/categories/:subcategory"
          element={
            <>
              <Navbar />
              <SubcategoryResults />
              <Footer />
            </>
          }
        />
        <Route
          path="/resources-room/all-resources"
          element={
            <>
              <Navbar />
              <AllResources />
              <Footer />
            </>
          }
        />
        <Route
          path="/chatcard"
          element={
            <>
              <Navbar />
              <ChatCard />
            </>
          }
        />

        {/* ==================== PROTECTED MEMBER ROUTES ==================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/resources"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <Resources />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/projects"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <Projects />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/projects/new"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <AddProject />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/events"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <Events />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ── Member Tasks ── */}
        <Route
          path="/dashboard/tasks"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <MyTasks />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/tasks/:id"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <TaskDetails />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Member Messages */}
        <Route
          path="/messages"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <Messages />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages/:id"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <Messages />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/hub-channel"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <HubChannel />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/edit-profile"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <MemberForm />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute requiredRole="Member">
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ==================== PROTECTED ADMIN ROUTES ==================== */}

        <Route
          path="/Admindashboard"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin-tasks"
          element={
            <ProtectedRoute requiredRole="Admin">
              <TaskManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin-events"
          element={
            <ProtectedRoute requiredRole="Admin">
              <EventTables />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminResources />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hire-requests"
          element={
            <ProtectedRoute requiredRole="Admin">
              <HireUsRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hire-inquiries/:id"
          element={
            <ProtectedRoute requiredRole="Admin">
              <HireRequestDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute requiredRole="Admin">
              <ApplicationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications/:id"
          element={
            <ProtectedRoute requiredRole="Admin">
              <ApplicationDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-resource"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AddResource />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin-members"
          element={
            <ProtectedRoute requiredRole="Admin">
              <MemberManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin-hero-members"
          element={
            <ProtectedRoute requiredRole="Admin">
              <HeroMembersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin-hub-video"
          element={
            <ProtectedRoute requiredRole="Admin">
              <HubVideoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin-alumni"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AlumniManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin-blogs"
          element={
            <ProtectedRoute requiredRole="Admin">
              <BlogTables />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admin-projects"
          element={
            <ProtectedRoute requiredRole="Admin">
              <ProjectTables />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute requiredRole="Admin">
              <ViewProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile/settings"
          element={
            <ProtectedRoute requiredRole="Admin">
              <ProfileSettings />
            </ProtectedRoute>
          }
        />

        {/* ── Admin Chat Routes ── */}
        <Route
          path="/admin/messages"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminChatLayout>
                <AdminMessages />
              </AdminChatLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/messages/:id"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminChatLayout>
                <AdminMessages />
              </AdminChatLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hub-channel"
          element={
            <ProtectedRoute requiredRole="Admin">
              <AdminChatLayout>
                <AdminHubChannel />
              </AdminChatLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AllRoutes;
