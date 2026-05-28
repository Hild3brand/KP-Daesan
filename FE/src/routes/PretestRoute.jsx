import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../services/api";

export default function PretestRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    check();
  }, []);

  const check = async () => {
    try {
      const res = await API.get("/pretest/check");

      setAllowed(!res.data.hasPretest);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return allowed ? children : <Navigate to="/student/dashboard" />;
}