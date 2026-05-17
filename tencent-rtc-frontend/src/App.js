import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage from './pages/LoginPage';
import PatientHome from './pages/patient/PatientHome';
import PatientConsult from './pages/patient/PatientConsult';
import PatientHistory from './pages/patient/PatientHistory';
import DoctorHome from './pages/doctor/DoctorHome';
import DoctorConsult from './pages/doctor/DoctorConsult';
import DoctorNotes from './pages/doctor/DoctorNotes';
import DoctorHistory from './pages/doctor/DoctorHistory';
import DemoBootstrap from './pages/DemoBootstrap';

function RequireAuth({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'doctor' ? '/doctor/home' : '/patient/home'} replace />;
  }
  return children;
}

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'doctor' ? '/doctor/home' : '/patient/home'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/demo/:role/:demoId" element={<DemoBootstrap />} />
          <Route path="/" element={<RoleRedirect />} />

          <Route
            path="/patient/home"
            element={
              <RequireAuth role="patient">
                <PatientHome />
              </RequireAuth>
            }
          />
          <Route
            path="/patient/consult"
            element={
              <RequireAuth role="patient">
                <PatientConsult />
              </RequireAuth>
            }
          />
          <Route
            path="/patient/history"
            element={
              <RequireAuth role="patient">
                <PatientHistory />
              </RequireAuth>
            }
          />

          <Route
            path="/doctor/home"
            element={
              <RequireAuth role="doctor">
                <DoctorHome />
              </RequireAuth>
            }
          />
          <Route
            path="/doctor/consult"
            element={
              <RequireAuth role="doctor">
                <DoctorConsult />
              </RequireAuth>
            }
          />
          <Route
            path="/doctor/notes"
            element={
              <RequireAuth role="doctor">
                <DoctorNotes />
              </RequireAuth>
            }
          />
          <Route
            path="/doctor/history"
            element={
              <RequireAuth role="doctor">
                <DoctorHistory />
              </RequireAuth>
            }
          />

          <Route path="*" element={<RoleRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
