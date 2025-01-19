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


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element=
          {
            <ProtectedRoute roles={["admin", "user"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/search" element=
          {
            <ProtectedRoute roles={["admin", "user"]}>
              <Result />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard" element=
          {
            <ProtectedRoute roles={["admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/faq" element=
          {
            <ProtectedRoute roles={["admin", "user"]}>
              <FAQ />
            </ProtectedRoute>
          }
        />
        <Route path="/link" element=
          {
            <ProtectedRoute roles={["admin", "user"]}>
              <ManajemenLink />
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
        <Route path="/layanan" element=
          {
            <ProtectedRoute roles={["admin", "user"]}>
              <Layanan />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
