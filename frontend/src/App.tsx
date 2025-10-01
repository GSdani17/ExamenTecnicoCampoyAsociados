import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

import AddEmpleadoPage from "./pages/AddEmpleadoPage";
import EditEmpleadoPage from "./pages/EditEmpleadoPage";
import ProyectoList from "./pages/ProyectoList";
import AddProyectoPage from "./pages/AddProyectoPage";
import EditProyectoPage from "./pages/EditProyectoPage";
import EmpleadoList from "./pages/EmpleadoList";
import ReportesPage from "./pages/ReportesPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/login";
  };

  return (
    <Router>
      {token && (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
          <div className="container">
            <NavLink className="navbar-brand" to="/">Prueba Técnica</NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/">Empleados</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/proyectos">Proyectos</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/reportes">Reportes</NavLink>
                </li>
              </ul>
              <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </nav>
      )}

      <div className="container">
        <Routes>
          <Route path="/login" element={<LoginPage setToken={setToken} />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <EmpleadoList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddEmpleadoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditEmpleadoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proyectos"
            element={
              <ProtectedRoute>
                <ProyectoList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proyectos/add"
            element={
              <ProtectedRoute>
                <AddProyectoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/proyectos/edit/:id"
            element={
              <ProtectedRoute>
                <EditProyectoPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reportes"
            element={
              <ProtectedRoute>
                <ReportesPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;