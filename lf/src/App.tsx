import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Faq from "./pages/faq";
import Contact from "./pages/contact";
import Auth from "./pages/auth";
import Found from "./pages/found";
import Report from "./pages/report";
import Navbar from "./components/navbar";
import { Outlet } from "react-router-dom";
import Settings from "./pages/settings";
import Profile from "./pages/profile";

function App() {
  const MainLayout = () => {
    return (
      <>
        <Navbar />
        <Outlet />
      </>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/report" element={<Report />} />
          <Route path="/found" element={<Found />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
