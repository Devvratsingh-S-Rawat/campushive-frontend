import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import FestDetail from "./pages/FestDetail";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import ListFest from "./pages/ListFest";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Home />} />
          <Route path="/fests/:id" element={<FestDetail />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/list-fest" element={<ListFest />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
