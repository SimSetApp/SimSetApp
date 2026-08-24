import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { ThemeProvider } from '@/lib/ThemeContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import BottomTabBar from './components/BottomTabBar';
import Home from './pages/Home';
import SetupGuide from './pages/SetupGuide';
import SavedSetups from './pages/SavedSetups';
import ProblemSolver from './pages/ProblemSolver';
import TuningGuide from './pages/TuningGuide';
import SetupMethodology from './pages/SetupMethodology';
import RaceEngineer from './pages/RaceEngineer';
import ShareSetup from './pages/ShareSetup';
import CommunityLibrary from './pages/CommunityLibrary';
import Support from './pages/Support';
import ThankYou from './pages/ThankYou';
import SetupWizard from './pages/SetupWizard';
import PitBoard from './pages/PitBoard';
import Dashboard from './pages/Dashboard';
import LearningPath from './pages/LearningPath';
import Telemetry from './pages/Telemetry';
import LiveTelemetry from './pages/LiveTelemetry';
import Profile from './pages/Profile.jsx';
import Messages from './pages/Messages.jsx';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.18, ease: "easeOut" } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.12, ease: "easeIn" } },
};


const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <>
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/setup-guide" element={<SetupGuide />} />
          <Route path="/saved-setups" element={<SavedSetups />} />
          <Route path="/problem-solver" element={<ProblemSolver />} />
          <Route path="/tuning-guide" element={<TuningGuide />} />
          <Route path="/methodology" element={<SetupMethodology />} />
          <Route path="/race-engineer" element={<RaceEngineer />} />
          <Route path="/share" element={<ShareSetup />} />
          <Route path="/community-library" element={<CommunityLibrary />} />
          <Route path="/setup-wizard" element={<SetupWizard />} />
          <Route path="/pit-board" element={<PitBoard />} />
          <Route path="/learning-path" element={<LearningPath />} />
          <Route path="/telemetry" element={<Telemetry />} />
          <Route path="/live-telemetry" element={<LiveTelemetry />} />
          <Route path="/support" element={<Support />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Navigate to="/profile?tab=messages" replace />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
    <BottomTabBar />
    </>
  );
};


function App() {

  return (
    <ThemeProvider>
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
    </ThemeProvider>
  )
}

export default App