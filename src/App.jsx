//理解済み
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import EventRegister from "./pages/EventRegister";
import { LangProvider } from "./contexts/LangContext";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEventRegistrations from "./pages/AdminEventRegistrations";
import RequireAuth from "./components/RequireAuth";


export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:slug" element={<EventDetail />} />
            <Route path="/events/:slug/register" element={<EventRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <RequireAuth>
                  <AdminDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/events/:id/registrations"
              element={
                <RequireAuth>
                  <AdminEventRegistrations />
                </RequireAuth>
              }
            />
          </Route>
        </Routes>
       

      </BrowserRouter>
    </LangProvider>
  );
}
