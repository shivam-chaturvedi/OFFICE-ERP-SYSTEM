import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { useState, useEffect } from "react";
import config from "./config";
import Loader from "./components/Loader";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${config.BACKEND_URL}/api/auth/verify-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Token validation failed:", err);
      } finally {
        setLoading(false); 
      }
    };

    verify();
  }, []);

  if (loading) return <Loader/>;
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user === null ? <Navigate to="/login" /> : <Home user={user} setUser={setUser}/>}
        />
        <Route
          path="/login"
          element={user !== null ? <Navigate to="/" /> : <Login setUser={setUser} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
