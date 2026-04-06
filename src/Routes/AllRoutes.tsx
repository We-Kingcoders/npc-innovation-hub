// src/Routes/AllRoutes.tsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "../components/button/Footer";
import Header from "../components/Header";
import LoginPage from "../pages/Login/LoginPage";
import HubMembersSection from "../pages/landing/HubMembersSection";
import Skills from "../pages/landing/Skills";
import TeamCaptain from "../pages/landing/TeamCaptain";
import HeroSection from "../pages/landing/HeroSection";
import Expertise from "../pages/landing/Expertise";
import Mission from "../pages/landing/Mission";
import SignUpPage from "../pages/Login/SignUp";
import ProjectsPage from "../pages/project-page/ProjectsPage";
import { InnovationHubMembersPage } from "../pages/all-member-page/InnovationHubMembersPage";
import { MemberDetailPage } from "../pages/all-member-page/MemberDetailPage";
import LetTalk from "../pages/HireUs/form";
import Partners from "../pages/HireUs/partners";
import Services from "../pages/HireUs/services";
import LatestPro from "../pages/HireUs/latespro";
import InnovationHub from "../pages/HireUs/FirstSection";
import BlogDesign from "../pages/AboutHub/Topics";
import BlogDetails from "../pages/blog/BlogDetails";
import MissionSection from "../pages/Hub-info/MissionSection";
import WhyHub from "../pages/Hub-info/WhyHub";
import FAQs from "../pages/Hub-info/FAQs";
import SupportCard from "../pages/Hub-info/Support";
import ChatCard from "../pages/Hub-info/Help";

// Resources Room
import Home from "../pages/resources-room/Home";
import Categories from "../pages/resources-room/Categories";
import SubcategoryResults from "../pages/resources-room/SubcategoryResults";
import AllResources from "../pages/resources-room/AllResources";

// Member Dashboard
import { DashboardLayout } from "../components/member/layouts/DashboardLayout";
import { Dashboard } from "../pages/member-page/Dashboard";
import { Resources } from "../pages/resources-page/Resources";
import { Projects } from "../pages/projects-page/Projects";
import AddProject from "../pages/add-project-page/AddProject";
import { Events } from "../pages/events-page/Events";
import { Messages } from "../pages/messages-page/Messages";
import { HubChannel } from "../pages/messages-page/HubChannel";
import MemberForm from "../components/member/MemberForm";
import MyTasks from "../pages/tasks/MyTasks";
import TaskDetails from "../pages/tasks/TaskDetails";

// Admin pages
import AdminDashboard from "../pages/Admin-pages/AdminDashboard";
import AdminResources from "../pages/Admin-pages/AdminResources";
import HireUsRequests from "../pages/Admin-pages/HireUsRequests";
import AddResource from "../pages/Admin-pages/AddResource";
import MemberManagement from "../pages/Admin-pages/MemberManagement";
import BlogTables from "../pages/Admin-pages/BlogTables";
import ProjectTables from "../pages/Admin-pages/ProjectTables";
import OTPVerification from "../pages/Login/OTPVerification";
import ForgotPassword from "../pages/Login/ForgotPassword";
import HireRequestDetail from "../components/admin-components/HireRequestDetail";
import EventTables from "../pages/Admin-pages/EventTables";
import TaskManagement from "../pages/Admin-pages/TaskManagement";
import ViewProfile from "../pages/Admin-pages/Profile/ViewProfile";
import ProfileSettings from "../pages/Admin-pages/Profile/ProfileSettings";

// Admin Chat pages
import AdminMessages from "../pages/Admin-pages/AdminMessages";
import AdminHubChannel from "../pages/Admin-pages/AdminHubChannel";
import AdminChatLayout from "../components/admin-components/AdminChatLayout";

// Auth
import { ProtectedRoute, PublicRoute } from "../components/ProtectedRoute";

const AllRoutes: React.FC = () => {
  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}

      <Route
        path="/"
        element={
          <>
            <HeroSection />
            <HubMembersSection />
            <Expertise />
            <Skills />
            <Mission />
            <TeamCaptain />
            <Footer />
          </>
        }
      />
      <Route
        path="/hire-us"
        element={
          <>
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
              <Header />
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
            <ProjectsPage />
            <Footer />
          </>
        }
      />
      <Route
        path="/members"
        element={
          <>
            <InnovationHubMembersPage />
            <Footer />
          </>
        }
      />
      <Route
        path="/members/:id"
        element={
          <>
            <MemberDetailPage />
            <Footer />
          </>
        }
      />

      {/* ── Blog routes ── */}
      <Route
        path="/blog"
        element={
          <>
            <Header />
            <BlogDesign />
            <Footer />
          </>
        }
      />
      <Route
        path="/blogs"
        element={
          <>
            <Header />
            <BlogDesign />
            <Footer />
          </>
        }
      />
      <Route
        path="/blogs/:id"
        element={
          <>
            <Header />
            <BlogDetails />
            <Footer />
          </>
        }
      />

      <Route
        path="/Hub-information"
        element={
          <>
            <Header />
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
            <Home />
            <Footer />
          </>
        }
      />
      <Route
        path="/resources-room/categories"
        element={
          <>
            <Categories />
            <Footer />
          </>
        }
      />
      <Route
        path="/resources-room/categories/:subcategory"
        element={
          <>
            <SubcategoryResults />
            <Footer />
          </>
        }
      />
      <Route
        path="/resources-room/all-resources"
        element={
          <>
            <AllResources />
            <Footer />
          </>
        }
      />
      <Route
        path="/chatcard"
        element={
          <>
            <Header />
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
  );
};

export default AllRoutes;
