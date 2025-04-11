import {
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  Circle,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  Calendar,
  CalendarControls,
  CalendarPrevButton,
  CalendarNextButton,
  CalendarMonths,
  CalendarMonth,
  CalendarMonthName,
  CalendarWeek,
  CalendarDays,
} from "@uselessdev/datepicker";
import {
  DayType,
  LeaveDay,
  LeaveTimelineItem,
} from "../services/holiday/holidayService";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { CustomCalendarDay } from "./CustomCalendarDay";
import { useCalendarDay } from "@uselessdev/datepicker";
var advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(advancedFormat);

// Holiday colors mapping
const HOLIDAY_COLORS = [
  "pink.400",
  "blue.400",
  "purple.400",
  "teal.400",
  "orange.400",
  "cyan.400",
  "green.400",
];

const LeaveDayItem: React.FC<{ leave: LeaveDay }> = ({ leave }) => {
  const dateFrom = dayjs(leave.dateFrom).format("DD MMM YYYY");
  const dateTo = dayjs(leave.dateTo).format("DD MMM YYYY");

  const publicHolidays = leave.timeline.filter(
    (x) => x.dayType === DayType.PublicHoliday
  );

  // Create a mapping of public holidays with assigned colors
  const holidayColorMap = useMemo(() => {
    const map = new Map<string, { color: string; name: string }>();

    publicHolidays.forEach((holiday, index) => {
      const colorIndex = index % HOLIDAY_COLORS.length;
      const dateString = holiday.date.format("YYYY-MM-DD");
      map.set(dateString, {
        color: HOLIDAY_COLORS[colorIndex],
        name: holiday.publicHolidayName || "",
      });
    });

    return map;
  }, [publicHolidays]);

  function humanizeDuration(quantity: number, word: string): string {
    return quantity <= 1 ? `1 ${word}` : `${quantity} ${word}s`;
  }

  // Create a custom calendar day component
  const CustomHolidayCalendarDay = () => {
    const { day } = useCalendarDay();
    const dateString = dayjs(day).format("YYYY-MM-DD");
    const holiday = holidayColorMap.get(dateString);

    if (holiday) {
      return (
        <CustomCalendarDay
          isPublicHoliday={true}
          holidayName={holiday.name}
          holidayColor={holiday.color}
        />
      );
    }

    return <CustomCalendarDay />;
  };

  return (
    <AccordionItem fontFamily="Lexend">
      {({ isExpanded }) => (
        <React.Fragment>
          <h2>
            <AccordionButton>
              <Box
                as="span"
                pt={3}
                pb={3}
                flex="1"
                display="flex"
                justifyContent="space-around"
                alignItems="center"
                textAlign="left"
                style={{ fontFeatureSettings: "tnum" }}
              >
                <Box
                  as="span"
                  flex={1}
                  // fontWeight={isExpanded ? "bold" : "regular"}
                  // color={isExpanded ? "green.500" : "black"}
                >
                  {dateFrom} →{" "}
                  <Box
                    display={{
                      base: "block",
                      md: "inline-block",
                    }}
                  >
                    {dateTo}
                  </Box>
                </Box>
                <Box as="span" flex={1} textAlign="center" fontWeight="bold">
                  {humanizeDuration(leave.daysOfLeave, "Day")}
                </Box>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          {isExpanded && (
            <AccordionPanel
              pb={4}
              display="flex"
              flexDirection={{ base: "column-reverse", md: "row" }}
            >
              <Box flex={1}>
                <Box mb={6}>
                  <Text mb={1.5} fontWeight="500">
                    {humanizeDuration(
                      leave.daysOfPublicHolidays,
                      "Public Holiday"
                    )}{" "}
                    {leave.daysOfPublicHolidays >= 3 && "🔥"}
                  </Text>
                  {publicHolidays?.length === 0 && ":("}
                  <VStack spacing={2} align="stretch" pl={1} mt={2}>
                    {publicHolidays.map((y, index) => {
                      const dateString = y.date.format("YYYY-MM-DD");
                      const holidayInfo = holidayColorMap.get(dateString);
                      const color = holidayInfo?.color || HOLIDAY_COLORS[0];

                      return (
                        <Box
                          key={y.publicHolidayName}
                          display="flex"
                          alignItems="center"
                        >
                          <Circle size="8px" bgColor={color} mr={2} />
                          <Box>
                            <Text
                              fontStyle="italic"
                              fontSize="xs"
                              color="gray.600"
                            >
                              {y.date.format("Do MMM")}
                            </Text>
                            <Text lineHeight="shorter">
                              {y.publicHolidayName}
                            </Text>
                          </Box>
                        </Box>
                      );
                    })}
                  </VStack>
                </Box>

                <Box>
                  <Text mb={1.5} fontWeight="500">
                    {humanizeDuration(leave.daysOfWeekend, "Weekend")}
                  </Text>

                  {leave.daysOfWeekend === 0 && ":("}
                  {leave.daysOfWeekend > 1 && (
                    <Text fontSize="sm">
                      {leave.daysOfWeekend} Saturdays and {leave.daysOfWeekend}{" "}
                      Sundays
                    </Text>
                  )}
                </Box>
              </Box>

              <Box
                display="flex"
                justifyContent="center"
                mb={{ base: 3, md: 0 }}
              >
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
                      <CalendarDays>
                        <CustomHolidayCalendarDay />
                      </CalendarDays>
                    </CalendarMonth>
                  </CalendarMonths>
                </Calendar>
              </Box>
            </AccordionPanel>
          )}
        </React.Fragment>
      )}
    </AccordionItem>
  );
};

export default LeaveDayItem;
