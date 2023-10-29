import axios from "axios";
import { IpInfo } from "./models/IpInfo";

const baseUrl = "https://ipapi.co";

export const getIpAddressInfo = async (): Promise<IpInfo> => {
  try {
    const response = await axios.get(`${baseUrl}/json/`);

    if (response.status !== 200) {
      throw new Error("Cannot get IP address information at this time!");
    }

    // Mapping the snake_case response to our camelCase model
    const data = response?.data;
    const mappedData: IpInfo = {
      ip: data?.ip,
      network: data?.network,
      version: data?.version,
      city: data?.city,
      region: data?.region,
      regionCode: data?.region_code,
      country: data?.country,
      countryName: data?.country_name,
      countryCode: data?.country_code,
      countryCodeIso3: data?.country_code_iso3,
      countryCapital: data?.country_capital,
      countryTld: data?.country_tld,
      continentCode: data?.continent_code,
      inEu: data?.in_eu,
      postal: data?.postal,
      latitude: data?.latitude,
      longitude: data?.longitude,
      timezone: data?.timezone,
      utcOffset: data?.utc_offset,
      countryCallingCode: data?.country_calling_code,
      currency: data?.currency,
      currencyName: data?.currency_name,
      languages: data?.languages,
      countryArea: data?.country_area,
      countryPopulation: data?.country_population,
      asn: data?.asn,
      org: data?.org,
    };

    return mappedData;
  } catch (error) {
    console.error("Error fetching IP address info:", error);
    throw error;
  }
};
