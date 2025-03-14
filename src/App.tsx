import "@fontsource/raleway/500.css";
import "@fontsource/lexend/300.css";
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
import SeoFaqItem from "./components/SeoFaqItem";
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
    if (!loadingCountries) {
      dropdownRef.current!.value = ipInfo?.countryCode ?? "";
      setCountryInput(ipInfo?.countryCode ?? "AD");
    }
  }, [ipInfo?.countryCode, loadingCountries]);

  return (
    <ChakraProvider theme={theme}>
      <Container
        mt={{ base: "3rem", md: "8rem" }}
        mb={{ base: "3rem", md: "8rem" }}
      >
        <Heading>Max My Leave 🤞</Heading>
        <Text color="gray.600">
          Get the most out of your days off! Tell us when and how long, and
          we'll find the best time to take leave using public holidays and
          weekends.
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

        {loadingLeaveDays && (
          <Spinner color="green" size="lg" display="flex" ml="auto" mr="auto" />
        )}

        {!loadingLeaveDays && (
          <Accordion defaultIndex={[0]} allowMultiple>
            {leaveDays?.map((leave) => (
              <LeaveDayItem
                key={leave.dateFrom.toString() + leave.dateTo.toString()}
                leave={leave}
              />
            ))}
          </Accordion>
        )}

        <SeoFaqItem
          question="What is Paid Time Off (PTO)?"
          answer="Paid Time Off (PTO) is a policy in which employees accumulate hours
            of paid leave for various purposes, including vacation, personal
            time, or illness. This time off ensures employees can take necessary
            breaks without financial stress."
        />

        <SeoFaqItem
          question="How do I accrue PTO at work?"
          answer="PTO accrual varies by company, but it generally accumulates based on the number of hours worked, tenure, or a set amount given at the beginning of each year. Check your company's policy for the specific accrual rate."
        />

        <SeoFaqItem
          question="When is the best time to take leave?"
          answer="The best time to take leave often depends on work schedules, project deadlines, and personal preferences. Generally, planning your leave during less busy periods at work and considering seasonal factors for your destination can lead to a more relaxing time off."
        />

        <SeoFaqItem
          question="How do I apply for PTO?"
          answer="Most companies require you to request PTO through an internal system or by notifying your manager. Provide as much notice as possible to ensure smooth workflow during your absence."
        />

        <SeoFaqItem
          question="Can unused PTO be carried over to the next year?"
          answer="Carryover policies vary. Some companies allow a certain amount of unused PTO to roll over, while others implement a 'use it or lose it' policy. Check your employee handbook or ask HR for your company's specific policy."
        />

        <SeoFaqItem
          question="What should I do if my PTO request is denied?"
          answer="If your PTO request is denied, speak with your manager to understand the reasons and explore alternative dates or solutions. Sometimes, it's a matter of business necessity, and flexibility can lead to an agreeable outcome."
        />

        <SeoFaqItem
          question="How does PTO benefit my work-life balance?"
          answer="Regularly taking time off helps prevent burnout, boosts creativity, and can lead to improved focus and productivity. PTO is an essential part of maintaining a healthy work-life balance."
        />
      </Container>
    </ChakraProvider>
  );
};
