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
export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify-email" element={<EmailVerify/>} />
                <Route path="/reset-password" element={<ResetPassword/>} />
                <Route element={<Layout/>}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/schedular" element={<Schedular />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/ai-composer" element={<AiComposer/>} />
                </Route>
            </Routes>
        </>
    );
}
