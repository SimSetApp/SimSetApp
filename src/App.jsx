import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

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
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<Home />} />
      <Route path="/setup-guide" element={<SetupGuide />} />
      <Route path="/saved-setups" element={<SavedSetups />} />
      <Route path="/problem-solver" element={<ProblemSolver />} />
      <Route path="/tuning-guide" element={<TuningGuide />} />
      <Route path="/methodology" element={<SetupMethodology />} />
      <Route path="/race-engineer" element={<RaceEngineer />} />
      <Route path="/share" element={<ShareSetup />} />
      <Route path="/community-library" element={<CommunityLibrary />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
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