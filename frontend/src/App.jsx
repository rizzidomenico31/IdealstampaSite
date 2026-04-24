import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Info from "./components/Info.jsx";
import Portfolio from "./components/Portfolio.jsx";
import Contact from "./components/Contact.jsx";
import Servizi from "./components/Servizi.jsx";
import Preventivo from "./components/Preventivo.jsx";
import PasswordProtection from "./components/PasswordProtection.jsx";
import NotFound from "./components/404.jsx";
import PrivacyPolicy from "./components/Privacy.jsx";
import CookiePolicy from "./components/Cookie.jsx";
import TerminiCondizioni from "./components/Termini.jsx";

import AdminLogin from "./components/admin/AdminLogin.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import AdminDashboard from "./components/admin/AdminDashboard.jsx";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";


export default function App() {
    return (
        <Routes>
            {/* Admin area — fuori da PasswordProtection e dalla Nav pubblica */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
            </Route>

            {/* Sito pubblico — sotto PasswordProtection + layout Nav */}
            <Route
                path="/*"
                element={
                    <PasswordProtection>
                        <Routes>
                            <Route path="/" element={<Nav />}>
                                <Route index element={<Hero />} />
                                <Route path="/info" element={<Info />} />
                                <Route path="/portfolio" element={<Portfolio />} />
                                <Route path="/contatti" element={<Contact />} />
                                <Route path="/servizi" element={<Servizi />} />
                                <Route path="/preventivo" element={<Preventivo />} />
                                <Route path="/privacy" element={<PrivacyPolicy />} />
                                <Route path="/cookies" element={<CookiePolicy />} />
                                <Route path="/termini" element={<TerminiCondizioni />} />
                                <Route path="*" element={<NotFound />} />
                            </Route>
                        </Routes>
                    </PasswordProtection>
                }
            />
        </Routes>
    );
}
