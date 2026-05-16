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
 
// loginpage -> role redirect -> home -> consult -> notes/history
function RequireAuth({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}
 
// role jump
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
          <Route path="/" element={<RoleRedirect />} />
 
          {/* patient */}
          <Route path="/patient/home"    element={<RequireAuth><PatientHome /></RequireAuth>} />
          <Route path="/patient/consult" element={<RequireAuth><PatientConsult /></RequireAuth>} />
          <Route path="/patient/history" element={<RequireAuth><PatientHistory /></RequireAuth>} />
 
          {/* doctor */}
          <Route path="/doctor/home"    element={<RequireAuth><DoctorHome /></RequireAuth>} />
          <Route path="/doctor/consult" element={<RequireAuth><DoctorConsult /></RequireAuth>} />
          <Route path="/doctor/notes"   element={<RequireAuth><DoctorNotes /></RequireAuth>} />
          <Route path="/doctor/history" element={<RequireAuth><DoctorHistory /></RequireAuth>} />
 
          {/* other */}
          <Route path="*" element={<RoleRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}