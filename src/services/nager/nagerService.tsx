import axios from "axios";
import { Country } from "./models/Country";
import { PublicHoliday } from "./models/PublicHoliday";

const baseUrl = "https://date.nager.at/api/v3";

export const getAvailableCountries = async (): Promise<Country[]> => {
  try {
    const response = await axios.get<Country[]>(
      `${baseUrl}/AvailableCountries`
    );

    if (response.status !== 200) {
      throw new Error("Cannot get countries at this time!");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching countries:", error);
    throw error;
  }
};

export const getPublicHolidays = async (
  countryCode: string,
  year: number
): Promise<PublicHoliday[]> => {
  try {
    const response = await axios.get<PublicHoliday[]>(
      `${baseUrl}/PublicHolidays/${year}/${countryCode}`
    );

    if (response.status !== 200) {
      throw new Error("Cannot get public holidays at this time!");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching public holidays:", error);
    throw error;
  }
};
