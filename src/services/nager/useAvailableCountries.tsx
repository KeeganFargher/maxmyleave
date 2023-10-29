
import { useState, useEffect } from "react";
import { getAvailableCountries } from "./nagerService";
import { Country } from "./models/Country";
import { AxiosError } from "axios";

const useAvailableCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loadingCountries, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCountries = await getAvailableCountries();
        setCountries(fetchedCountries);
      } catch (err) {
        setError(err as AxiosError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { countries, loadingCountries, error };
};

export default useAvailableCountries;
