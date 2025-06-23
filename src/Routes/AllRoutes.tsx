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
            <HeroSection />

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
    </Routes>
  );
};

export default AllRoutes;
