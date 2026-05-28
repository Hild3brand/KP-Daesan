import { Navigate } from "react-router-dom";

import { useEffect, useState } from "react";

import API from "../services/api";

export default function PretestDoneRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    checkPretest();
  }, []);

  const checkPretest = async () => {
    try {
      const res = await API.get("/pretest/check");

      setAllowed(res.data.hasPretest);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!allowed) {
    return <Navigate to="/student/dashboard" />;
  }

  return children;
}