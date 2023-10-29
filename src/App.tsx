import "@fontsource/raleway/500.css";
import "@fontsource/lexend/400.css";
import "@fontsource/lexend/500.css";
import "@fontsource/lexend/600.css";
import "@fontsource/lexend/700.css";

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
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
  ListItem,
  Select,
  Text,
  UnorderedList,
  extendTheme,
} from "@chakra-ui/react";
import useAvailableCountries from "./services/nager/useAvailableCountries";
import useIpAddressInfo from "./services/ipLookup/useIpAddressInfo";
import { useRef } from "react";
import React from "react";
import {
  DayType,
  LeaveDay,
  getBestLeaveDays,
} from "./services/holiday/holidayService";
import dayjs from "dayjs";
import {
  Calendar,
  CalendarControls,
  CalendarDays,
  CalendarDefaultTheme,
  CalendarMonth,
  CalendarMonthName,
  CalendarMonths,
  CalendarNextButton,
  CalendarPrevButton,
  CalendarWeek,
} from "@uselessdev/datepicker";
var localizedFormat = require("dayjs/plugin/localizedFormat");
dayjs.extend(localizedFormat);

const theme = extendTheme({
  ...CalendarDefaultTheme,
  colors: {
    primary: {
      50: "#FAF5FF",
      100: "#E9D8FD",
      200: "#D6BCFA",
      300: "#B794F4",
      400: "#9F7AEA",
      500: "#805AD5",
      600: "#6B46C1",
      700: "#553C9A",
      800: "#44337A",
      900: "#322659",
    },
  },
  fonts: {
    heading: `'Lexend', sans-serif`,
    body: `'Raleway', sans-serif`,
    button: "'Lexend', sans-serif",
  },
});

const BASE_START_DATE = new Date();
const BASE_END_DATE = new Date(BASE_START_DATE.getFullYear() + 1, 0, 31);

const formatDate = (item: Date) => item.toISOString().split("T")?.[0];

export const App = () => {
  const [leaveDays, setLeaveDays] = React.useState<LeaveDay[]>([]);

  const [leaveDaysInput, setLeaveDaysInput] = React.useState(5);

  const dropdownRef = useRef<HTMLSelectElement | null>(null);

  const { countries, loadingCountries } = useAvailableCountries();
  const { ipInfo, loadingIpInfo, errorIpInfo } = useIpAddressInfo();

  React.useEffect(() => {
    dropdownRef.current!.value = ipInfo?.countryCode ?? "";
  }, [ipInfo]);

  React.useEffect(() => {
    getBestLeaveDays({
      CountryCode: "ZA",
      DateFrom: BASE_START_DATE,
      DateTo: BASE_END_DATE,
      NumberOfDays: 7,
    }).then((x) => {
      setLeaveDays(x);
      console.log(x);
    });
  }, []);

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
              defaultValue={5}
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

          {/* <Button
            display="flex"
            minW="80px"
            mt={6}
            ml="auto"
            size="sm"
            colorScheme="primary"
          >
            Go{" "}
          </Button> */}
        </Box>

        <Divider borderColor="transparent" mt={8} mb={8}></Divider>

        <Accordion defaultIndex={[0]} allowMultiple>
          {leaveDays.map((leave, index) => {
            const dateFrom = dayjs(leave.dateFrom).format("DD MMM YYYY");
            const dateTo = dayjs(leave.dateTo).format("DD MMM YYYY");

            return (
              <AccordionItem fontFamily="Lexend" key={index.toString()}>
                <h2>
                  <AccordionButton>
                    <Box
                      as="span"
                      pt={3}
                      pb={3}
                      flex="1"
                      display="flex"
                      justifyContent="space-around"
                      textAlign="left"
                      style={{ fontFeatureSettings: "tnum" }}
                    >
                      <Box as="span" flex={1}>
                        {dateFrom} → {dateTo}
                      </Box>
                      <Box
                        as="span"
                        flex={1}
                        textAlign="center"
                        fontWeight="bold"
                      >
                        {leave.daysOfLeave} Days
                      </Box>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} display="flex">
                  <Box>
                    <Text mb={0}>
                      {leave.daysOfWeekend} Weekends •{" "}
                      {leave.daysOfPublicHolidays} Public Holidays
                    </Text>
                    <Text mb={3} fontSize="sm" color="gray.600">
                      If you took leave from {dateFrom} till {dateTo}, you will
                      receive {leave.daysOfLeave} days of leave instead of 5!
                    </Text>
                    <UnorderedList fontSize="sm" color="gray.600">
                      {leave.timeline
                        .filter((x) => x.dayType === DayType.PublicHoliday)
                        .map((y) => (
                          <ListItem key={y.publicHolidayName}>
                            {y.publicHolidayName}
                          </ListItem>
                        ))}
                    </UnorderedList>
                  </Box>

                  <Calendar
                    value={{
                      start: leave.dateFrom.toDate(),
                      end: leave.dateTo.toDate(),
                    }}
                    onSelectDate={() => {}}
                  >
                    <CalendarControls>
                      <CalendarPrevButton />
                      <CalendarNextButton />
                    </CalendarControls>

                    <CalendarMonths>
                      <CalendarMonth>
                        <CalendarMonthName />
                        <CalendarWeek />
                        <CalendarDays />
                      </CalendarMonth>
                    </CalendarMonths>
                  </Calendar>
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        </Accordion>
      </Container>
    </ChakraProvider>
  );
};
