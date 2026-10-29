
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router";

import { ScrollToTop } from "./components/common/ScrollToTop";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

import AppLayout from "./layout/AppLayout";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import Calendar from "./pages/Calendar";
import BarChart from "./pages/Charts/BarChart";
import LineChart from "./pages/Charts/LineChart";
import Home from "./pages/Dashboard/Ecommerce";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/OtherPage/Blank";
import NotFound from "./pages/OtherPage/NotFound";
import BasicTables from "./pages/Tables/BasicTables";
import Alerts from "./pages/UiElements/Alerts";
import Avatars from "./pages/UiElements/Avatars";
import Badges from "./pages/UiElements/Badges";
import Buttons from "./pages/UiElements/Buttons";
import Images from "./pages/UiElements/Images";
import Videos from "./pages/UiElements/Videos";
import UserProfiles from "./pages/UserProfiles";

function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">
          Vérification de la session...
        </p>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        {/* Pages accessibles uniquement après connexion */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/blank" element={<Blank />} />

            <Route path="/form-elements" element={<FormElements />} />

            <Route path="/basic-tables" element={<BasicTables />} />

            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>
        </Route>

        {/* Pages de connexion et d'inscription */}
        <Route
          path="/signin"
          element={
            <AuthRedirect>
              <SignIn />
            </AuthRedirect>
          }
        />

        <Route
          path="/signup"
          element={
            <AuthRedirect>
              <SignUp />
            </AuthRedirect>
          }
        />

        {/* Page introuvable */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
