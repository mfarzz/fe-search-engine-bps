import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"

//import pages
import Login from "./pages/login"
import Home from "./pages/home"
import Dashboard from "./pages/dashboard"
import NotFound from "./pages/notFound"
import Result from "./pages/result"
import FAQ from "./pages/faq"
import ManajemenLink from "./pages/manajemenLink"
import ManajemenUser from "./pages/manajemenUser"
import Layanan from "./pages/layanan"
import GoogleCallback from './components/GoogleCallback';

function App() {  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/google/success" element={<GoogleCallback />} />
        
        {/* Public Routes & Routes for all roles */}
        <Route path="/home" element={<Home />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/search" element={<Result />} />
        <Route path="/layanan" element={<Layanan />} />

        {/* Protected Routes for admin & user only */}
        <Route path="/link" element=
          {
            <ProtectedRoute roles={["admin", "user"]}>
              <ManajemenLink />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes for admin only */}
        <Route path="/dashboard" element=
          {
            <ProtectedRoute roles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/user" element=
          {
            <ProtectedRoute roles={["admin"]}>
              <ManajemenUser />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App