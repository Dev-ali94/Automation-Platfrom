import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Account from "./pages/Account";
import Dashboard from "./pages/Dashboard";
import Schedular from "./pages/Schedular";
import AiComposer from "./pages/AiComposer";

export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
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
