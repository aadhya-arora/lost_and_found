import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Faq from "./pages/faq";
import Contact from "./pages/contact";
import Auth from "./pages/auth";
import Navbar from "./components/navbar";
import { Outlet } from "react-router-dom";

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
        </Route>

        {/* Route without Navbar */}
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
