import "@fontsource/raleway/500.css";
import "@fontsource/lexend/400.css";
import "@fontsource/lexend/500.css";
import "@fontsource/lexend/600.css";
import "@fontsource/lexend/700.css";

import {
  Accordion,
  Box,
  ChakraProvider,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Heading,
  Input,
  Select,
  Spinner,
  Text,
} from "@chakra-ui/react";
import useAvailableCountries from "./services/nager/useAvailableCountries";
import useIpAddressInfo from "./services/ipLookup/useIpAddressInfo";
import { useRef } from "react";
import React from "react";
import { LeaveDay, getBestLeaveDays } from "./services/holiday/holidayService";
import dayjs from "dayjs";
import LeaveDayItem from "./components/LeaveDayItem";
import theme from "./utils/theme";
import { useBestLeaveDays } from "./services/holiday/useBestLeaveDays";
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

const BASE_START_DATE = new Date();
const BASE_END_DATE = new Date(BASE_START_DATE.getFullYear() + 1, 0, 31);
const BASE_LEAVE_DAYS = 5;

const formatDate = (item: Date) => item.toISOString().split("T")?.[0];

export const App = () => {
  const [leaveDaysInput, setLeaveDaysInput] = React.useState(BASE_LEAVE_DAYS);
  const [startDateInput, setStartDateInput] = React.useState(BASE_START_DATE);
  const [endDateInput, setEndDateInput] = React.useState(BASE_END_DATE);
  const [countryInput, setCountryInput] = React.useState<string>("AD");

  const dropdownRef = useRef<HTMLSelectElement | null>(null);

  const { countries, loadingCountries } = useAvailableCountries();
  const { ipInfo, loadingIpInfo, errorIpInfo } = useIpAddressInfo();
  const { leaveDays, loadingLeaveDays, errorLeaveDays } = useBestLeaveDays({
    CountryCode: countryInput,
    DateFrom: startDateInput,
    DateTo: endDateInput,
    NumberOfDays: leaveDaysInput,
  });

  React.useEffect(() => {
    dropdownRef.current!.value = ipInfo?.countryCode ?? "";
    setCountryInput(ipInfo?.countryCode ?? "AD");
  }, [ipInfo]);

  return (
    <ChakraProvider theme={theme}>
      <Container
        mt={{ base: "3rem", md: "8rem" }}
        mb={{ base: "3rem", md: "8rem" }}
      >
        <Heading>Max My Leave 🤞</Heading>
        <Text color="gray.500">
          Get the most out of your days off! Tell us when and how long, and
          we'll find the best breaks using public holidays and weekends.
        </Text>

        <Box mt={6}>
          <FormControl width={{ base: "100%", md: "50%" }}>
            <FormLabel fontSize="sm" mb={1}>
              Leave Days
            </FormLabel>
            <Input
              size="md"
              variant="filled"
              type="number"
              defaultValue={BASE_LEAVE_DAYS}
              min={2}
              onChange={(e) => setLeaveDaysInput(e.target.valueAsNumber)}
            />
          </FormControl>

          <HStack
            // direction={{ base: "column", md: "row" }} not sure???
            spacing={3}
            mt={3}
            display="flex"
          >
            <FormControl>
              <FormLabel fontSize="sm" mb={1}>
                Start Date
              </FormLabel>
              <Input
                size="md"
                variant="filled"
                type="date"
                defaultValue={formatDate(BASE_START_DATE)}
                onChange={(e) =>
                  setStartDateInput(e.target.valueAsDate as Date)
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" mb={1}>
                End Date
              </FormLabel>
              <Input
                size="md"
                variant="filled"
                type="date"
                defaultValue={formatDate(BASE_END_DATE)}
                onChange={(e) => setEndDateInput(e.target.valueAsDate as Date)}
              />
            </FormControl>
          </HStack>

          <HStack mt={3}>
            <FormControl isDisabled={loadingCountries}>
              <FormLabel fontSize="sm" mb={1}>
                Country
              </FormLabel>
              <Select
                isDisabled={loadingCountries}
                ref={dropdownRef}
                variant="filled"
                size="md"
                placeholder="Select country"
                onChange={(e) => setCountryInput(e.target.value)}
              >
                {countries?.map((country) => (
                  <option key={country.countryCode} value={country.countryCode}>
                    {country.name}
                  </option>
                ))}
              </Select>
              {errorIpInfo && (
                <FormHelperText>
                  There was an error fetching the country you live in.
                </FormHelperText>
              )}
            </FormControl>
          </HStack>
        </Box>

        <Divider borderColor="transparent" mt={8} mb={8}></Divider>

         {loadingLeaveDays && <Spinner />}

        {!loadingLeaveDays && (
          <Accordion  defaultIndex={[0]} allowMultiple>
            {leaveDays?.map((leave) => (
              <LeaveDayItem
                key={leave.dateFrom.toString() + leave.dateTo.toString()}
                leave={leave}
              />
            ))}
          </Accordion>
        )} 
      </Container>
    </ChakraProvider>
  );
};
