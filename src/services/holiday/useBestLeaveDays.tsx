import { useState, useEffect, useRef } from "react";
import { LeaveRequest, LeaveDay, getBestLeaveDays } from "./holidayService";
import { usePostHog } from "posthog-js/react";

export const useBestLeaveDays = (request: LeaveRequest) => {
  const [leaveDays, setData] = useState<LeaveDay[] | null>(null);
  const [loadingLeaveDays, setLoading] = useState<boolean>(true);
  const [errorLeaveDays, setError] = useState<Error | null>(null);

  const posthog = usePostHog();

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setLoading(true);
      getBestLeaveDays(request)
        .then((results) => {
          posthog.capture("Leave Request", request);
          setData(results);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    }, 1000);

    // Cleanup function
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [
    request.DateFrom,
    request.DateTo,
    request.CountryCode,
    request.NumberOfDays,
  ]);

  return { leaveDays, loadingLeaveDays, errorLeaveDays };
};
