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

// Dashboard
import { DashboardLayout } from "../components/member/layouts/DashboardLayout";
import { Dashboard } from "../pages/member-page/Dashboard";
import { Resources } from "../pages/resources-page/Resources";
import { Projects } from "../pages/projects-page/Projects";
import { AddProject } from "../pages/add-project-page/AddProject";
import { Events } from "../pages/events-page/Events";
import { Messages } from "../pages/messages-page/Messages";
import { HubChannel } from "../pages/messages-page/HubChannel";

import MemberForm from "../components/member/MemberForm";
import AdminDashboard from "../pages/Admin-pages/AdminDashboard";
import AdminResources from "../pages/Admin-pages/AdminResources";
import HireUsRequests from "../pages/Admin-pages/HireUsRequests";
import AddResource from "../pages/Admin-pages/AddResource";
import MemberManagement from "../pages/Admin-pages/MemberManagement";
import BlogTables from "../pages/Admin-pages/BlogTables";
import ProjectTables from "../pages/Admin-pages/ProjectTables";
import OTPVerification from "../pages/Login/OTPVerification";
import HireRequestDetail from "../components/admin-components/HireRequestDetail";

const AllRoutes: React.FC = () => {
  return (
    <Routes>
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
      <Route path="/admin/hire-inquiries/:id" element={<HireRequestDetail />} />

      <Route
        path="/login"
        element={
          <>
            <Header />
            <LoginPage />
          </>
        }
      />
      <Route
        path="/signup"
        element={
          <>
            <Header />
            <SignUpPage />
          </>
        }
      />
      <Route
        path="/otp"
        element={
          <>
            <Header />
            <OTPVerification />
          </>
        }
      />
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
            <Header />
            <InnovationHubMembersPage />
            <Footer />
          </>
        }
      />
      <Route
        path="/members/:id"
        element={
          <>
            <Header />
            <MemberDetailPage />
            <Footer />
          </>
        }
      />
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
            <Header />
            <Home />
            <Footer />
          </>
        }
      />
      <Route
        path="/resources-room/categories"
        element={
          <>
            <Header />
            <Categories />
            <Footer />
          </>
        }
      />
      <Route
        path="/resources-room/categories/:subcategory"
        element={
          <>
            <Header />
            <SubcategoryResults />
            <Footer />
          </>
        }
      />
      <Route
        path="/resources-room/all-resources"
        element={
          <>
            <Header />
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

      {/* Member Dashboard */}
      <Route
        path="/dashboard"
        element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/resources"
        element={
          <DashboardLayout>
            <Resources />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/projects"
        element={
          <DashboardLayout>
            <Projects />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/projects/new"
        element={
          <DashboardLayout>
            <AddProject />
          </DashboardLayout>
        }
      />
      <Route
        path="/dashboard/events"
        element={
          <DashboardLayout>
            <Events />
          </DashboardLayout>
        }
      />
      <Route
        path="/messages/:id"
        element={
          <DashboardLayout>
            <Messages />
          </DashboardLayout>
        }
      />
      <Route
        path="/hub-channel"
        element={
          <DashboardLayout>
            <HubChannel />
          </DashboardLayout>
        }
      />

      <Route
        path="/dashboard/edit-profile"
        element={
          <DashboardLayout>
            <MemberForm />
          </DashboardLayout>
        }
      />
      <Route path="/Admindashboard" element={<AdminDashboard />} />
      <Route path="/resources" element={<AdminResources />} />
      <Route path="/hire-requests" element={<HireUsRequests />} />
      <Route path="/add-resource" element={<AddResource />} />

      <Route path="/Admin-members" element={<MemberManagement />} />
      <Route path="/Admin-blogs" element={<BlogTables />} />
      <Route path="/Admin-projects" element={<ProjectTables />} />
    </Routes>
  );
};

export default AllRoutes;
