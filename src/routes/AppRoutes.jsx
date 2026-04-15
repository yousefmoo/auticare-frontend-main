/**
 * App Routes
 * Main routing configuration
 */

import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import LandingPage from "../features/public/LandingPage";
import AboutPage from "../features/public/AboutPage";
import PublicSessionsPage from "../features/public/PublicSessionsPage";
import QuestionnaireExperience from "../features/public/QuestionnaireExperience";
import DashboardLayout from "../components/layout/DashboardLayout";
import PublicLayout from "../components/layout/PublicLayout";
import ProtectedRoute from "../components/shared/ProtectedRoute";
import DoctorHomeDashboard from "../features/doctor/pages/DoctorHomeDashboard";
import DoctorPatientsPage from "../features/doctor/pages/DoctorPatientsPage";
import DoctorSessionsDashboard from "../features/doctor/pages/DoctorSessionsDashboard";
import DoctorTreatmentPlansPage from "../features/doctor/DoctorTreatmentPlansPage";
import DoctorAssessmentsPage from "../features/doctor/DoctorAssessmentsPage";
import TherapistHomeDashboard from "../features/therapist/pages/TherapistHomeDashboard";
import TherapistPatientsPage from "../features/therapist/pages/TherapistPatientsPage";
import TherapistSessionsDashboard from "../features/therapist/pages/TherapistSessionsDashboard";
import TherapistWeeklyPlansPage from "../features/therapist/TherapistWeeklyPlansPage";
import TherapistSessionNotesPage from "../features/therapist/TherapistSessionNotesPage";
import TherapistStatisticsPage from "../features/therapist/TherapistStatisticsPage";
import ParentHomeDashboard from "../features/parent/pages/ParentHomeDashboard";
import ParentCareRecommendations from "../features/parent/ParentCareRecommendations";
import ParentFeedbackPage from "../features/parent/ParentFeedbackPage";
import ParentNotesDashboard from "../features/parent/pages/ParentNotesDashboard";
import ParentRetestDashboard from "../features/parent/pages/ParentRetestDashboard";
import ParentSessionsDashboard from "../features/parent/pages/ParentSessionsDashboard";
import ParentWeeklyPlanPro from "../features/parent/ParentWeeklyPlanPro";
import ProgressStatistics from "../features/parent/ProgressStatistics";
import ParentResourcesPage from "../features/parent/ParentResourcesPage";
import TreatmentPlanPage from "../features/parent/pages/TreatmentPlanPage";
import NotFound from "../features/shared/NotFound";
import Unauthorized from "../features/shared/Unauthorized";
import RoleSettingsPage from "../features/shared/RoleSettingsPage";
import RoleProfilePage from "../features/shared/RoleProfilePage";
import SessionCallRoomPage from "../features/shared/SessionCallRoomPage";
import MessagesPage from "../features/messages/pages/MessagesPage";
import ReportsDashboardPage from "../features/reports/pages/ReportsDashboardPage";
import SpecialistsDirectoryPage from "../features/specialists/pages/SpecialistsDirectoryPage";

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/sessions", element: <PublicSessionsPage /> },
      { path: "/questionnaire", element: <QuestionnaireExperience /> },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
    ],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },

  // DOCTOR ROUTES
  {
    path: "/doctor",
    element: (
      <ProtectedRoute allowedRoles={["doctor"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: "home", element: <DoctorHomeDashboard /> },
      { path: "dashboard", element: <Navigate to="/doctor/home" replace /> },
      { path: "patients", element: <DoctorPatientsPage /> },
      { path: "treatment-plans", element: <DoctorTreatmentPlansPage /> },
      { path: "reports", element: <ReportsDashboardPage /> },
      { path: "assessments", element: <DoctorAssessmentsPage /> },
      { path: "sessions", element: <DoctorSessionsDashboard /> },
      { path: "sessions/live", element: <SessionCallRoomPage /> },
      { path: "messages", element: <MessagesPage /> },
      { path: "specialists", element: <SpecialistsDirectoryPage /> },
      { path: "settings", element: <RoleSettingsPage /> },
      { path: "profile", element: <RoleProfilePage /> },
    ],
  },

  // THERAPIST ROUTES
  {
    path: "/therapist",
    element: (
      <ProtectedRoute allowedRoles={["therapist"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: "home", element: <TherapistHomeDashboard /> },
      { path: "dashboard", element: <Navigate to="/therapist/home" replace /> },
      { path: "patients", element: <TherapistPatientsPage /> },
      { path: "weekly-plans", element: <TherapistWeeklyPlansPage /> },
      { path: "session-notes", element: <TherapistSessionNotesPage /> },
      { path: "sessions", element: <TherapistSessionsDashboard /> },
      { path: "sessions/live", element: <SessionCallRoomPage /> },
      { path: "messages", element: <MessagesPage /> },
      { path: "reports", element: <ReportsDashboardPage /> },
      { path: "specialists", element: <SpecialistsDirectoryPage /> },
      { path: "statistics", element: <TherapistStatisticsPage /> },
      { path: "settings", element: <RoleSettingsPage /> },
      { path: "profile", element: <RoleProfilePage /> },
    ],
  },

  // PARENT ROUTES
  {
    path: "/parent",
    element: (
      <ProtectedRoute allowedRoles={["parent"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: "home", element: <ParentHomeDashboard /> },
      { path: "dashboard", element: <Navigate to="/parent/home" replace /> },
      { path: "notes", element: <ParentNotesDashboard /> },
      { path: "retest", element: <ParentRetestDashboard /> },
      { path: "care-recommendations", element: <ParentCareRecommendations /> },
      { path: "feedback", element: <ParentFeedbackPage /> },
      { path: "weekly-plan", element: <ParentWeeklyPlanPro /> },
      { path: "treatment-plan", element: <TreatmentPlanPage /> },
      { path: "sessions", element: <ParentSessionsDashboard /> },
      { path: "sessions/live", element: <SessionCallRoomPage /> },
      { path: "progress", element: <ProgressStatistics /> },
      { path: "resources", element: <ParentResourcesPage /> },
      { path: "messages", element: <MessagesPage /> },
      { path: "reports", element: <ReportsDashboardPage /> },
      { path: "specialists", element: <SpecialistsDirectoryPage /> },
      { path: "settings", element: <RoleSettingsPage /> },
      { path: "profile", element: <RoleProfilePage /> },
    ],
  },

  // 404 Page
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
