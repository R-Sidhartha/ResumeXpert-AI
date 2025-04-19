import { useEffect, useState } from "react";

export const usePlanValidator = () => {
  const [wasDowngraded, setWasDowngraded] = useState(false);

  useEffect(() => {
    // Check if we've validated today already
    const lastCheckedDate = localStorage.getItem("lastPlanCheckDate");

    // If today has already been validated, return early
    if (lastCheckedDate === new Date().toLocaleDateString()) {
      return;
    }
    const check = async () => {
      try {
        const res = await fetch("/api/check-downgrade");
        const data = await res.json();
        if (data.downgraded) {
          setWasDowngraded(true);
        }
      } catch (err) {
        console.error("Downgrade check failed", err);
      }
    };

    check();
    localStorage.setItem("lastPlanCheckDate", new Date().toLocaleDateString());
  }, []);

  return { wasDowngraded };
};
