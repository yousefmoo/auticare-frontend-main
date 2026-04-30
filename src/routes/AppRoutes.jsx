/**
 * App Routes
 * Main routing configuration
 */

import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "@/features/auth/Login";
import Signup from "@/features/auth/Signup";
import LandingPage from "@/features/public/LandingPage";
import AboutPage from "@/features/public/AboutPage";
import QuestionnairePage from "@/features/public/QuestionnairePage";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PublicLayout from "@/components/layout/PublicLayout";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import DoctorHomeDashboard from "@/features/doctor/DoctorHomeDashboard";
import DoctorPatientsPage from "@/features/doctor/DoctorPatientsView";
import DoctorSessionsDashboard from "@/features/doctor/DoctorSessionsDashboard";
import DoctorTreatmentPlansPage from "@/features/doctor/DoctorTreatmentPlansPage";
import DoctorScreeningPage from "@/features/doctor/DoctorScreeningPage";
import TherapistHomeDashboard from "@/features/therapist/TherapistHomeDashboard";
import TherapistPatientsPage from "@/features/therapist/TherapistPatientsView";
import TherapistSessionsDashboard from "@/features/therapist/TherapistSessionsDashboard";
import TherapistWeeklyPlansPage from "@/features/therapist/TherapistWeeklyPlansPage";
import TherapistSessionNotesPage from "@/features/therapist/TherapistSessionNotesPage";
import TherapistStatisticsPage from "@/features/therapist/TherapistStatisticsPage";
import ParentHomeDashboard from "@/features/parent/ParentHomeDashboard";
import ParentCareRecommendations from "@/features/parent/ParentCareRecommendations";
import ParentFeedbackPage from "@/features/parent/ParentFeedbackPage";
import ParentNotesDashboard from "@/features/parent/ParentNotesDashboard";
import ScreeningResultsPage from "@/features/parent/ScreeningResultsPage";
import ParentSessionsDashboard from "@/features/parent/ParentSessionsDashboard";
import ParentWeeklyPlanPro from "@/features/parent/ParentWeeklyPlanPro";
import ProgressStatistics from "@/features/parent/ProgressStatistics";
import ParentResourcesPage from "@/features/parent/ParentResourcesPage";
import TreatmentPlanPage from "@/features/parent/TreatmentPlanPage";
import ParentQuestionnairePage from "@/features/parent/ParentQuestionnairePage";
import ParentRetestPage from "@/features/parent/ParentRetestPage";
import NotFound from "@/features/shared/NotFound";
import Unauthorized from "@/features/shared/Unauthorized";
import RoleSettingsPage from "@/features/shared/RoleSettingsPage";
import RoleProfilePage from "@/features/shared/RoleProfilePage";
import SessionCallRoomPage from "@/features/shared/SessionCallRoomPage";
import MessagesPage from "@/features/messages/pages/MessagesPage";
import ReportsDashboardPage from "@/features/reports/pages/ReportsDashboardPage";
import SpecialistsDirectoryPage from "@/features/specialists/pages/SpecialistsDirectoryPage";
import { USER_ROLES } from "@/utils/constants";

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/questionnaire", element: <QuestionnairePage /> },
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
      <ProtectedRoute allowedRoles={[USER_ROLES.DOCTOR]}>
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
      { path: "screening", element: <DoctorScreeningPage /> },
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
      <ProtectedRoute allowedRoles={[USER_ROLES.THERAPIST]}>
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
      <ProtectedRoute allowedRoles={[USER_ROLES.PARENT]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: "home", element: <ParentHomeDashboard /> },
      { path: "dashboard", element: <Navigate to="/parent/home" replace /> },
      { path: "notes", element: <ParentNotesDashboard /> },
      { path: "screening-results", element: <ScreeningResultsPage /> },
      { path: "screening-results/:childId", element: <ScreeningResultsPage /> },
      { path: "care-recommendations", element: <ParentCareRecommendations /> },
      { path: "feedback", element: <ParentFeedbackPage /> },
      { path: "weekly-plan", element: <ParentWeeklyPlanPro /> },
      { path: "treatment-plan", element: <TreatmentPlanPage /> },
      { path: "questionnaire", element: <ParentQuestionnairePage /> },
      { path: "retest", element: <ParentRetestPage /> },
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
