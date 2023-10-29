import { useState, useEffect } from "react";
import { getIpAddressInfo } from "./ipAddressInfoService";
import { IpInfo } from "./models/IpInfo";
import { AxiosError } from "axios";

const useIpAddressInfo = () => {
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [loadingIpInfo, setLoading] = useState<boolean>(true);
  const [errorIpInfo, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await getIpAddressInfo();
        setIpInfo(info);
      } catch (err) {
        setError(err as AxiosError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { ipInfo, loadingIpInfo, errorIpInfo };
};

export default useIpAddressInfo;
