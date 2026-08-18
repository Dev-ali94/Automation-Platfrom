import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Account from "./pages/Account";
import Dashboard from "./pages/Dashboard";
import Schedular from "./pages/Schedular";
import AiComposer from "./pages/AiComposer";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmailRoute from "./config/ProtectedVerifyRoute";
import ProtectedRoute from "./config/ProtectedRoute";
import { Toaster } from "react-hot-toast";

export default function App() {
    return (
        <>
            <Toaster position="top-right" />

            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                <Route
                    path="/verify-email"
                    element={
                        <VerifyEmailRoute>
                            <EmailVerify />
                        </VerifyEmailRoute>
                    }
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />

                {/* Protected routes */}
                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/schedular" element={<Schedular />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/ai-composer" element={<AiComposer />} />
                </Route>
            </Routes>
        </>
    );
}