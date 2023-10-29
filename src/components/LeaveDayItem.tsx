import {
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  UnorderedList,
  ListItem,
  Text,
  Box,
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
import { DayType, LeaveDay } from "../services/holiday/holidayService";
import dayjs from "dayjs";

const LeaveDayItem: React.FC<{ leave: LeaveDay }> = ({ leave }) => {
  const dateFrom = dayjs(leave.dateFrom).format("DD MMM YYYY");
  const dateTo = dayjs(leave.dateTo).format("DD MMM YYYY");

  return (
    <AccordionItem fontFamily="Lexend">
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
            <Box as="span" flex={1} textAlign="center" fontWeight="bold">
              {leave.daysOfLeave} Days
            </Box>
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel
        pb={4}
        display="flex"
        flexDirection={{ base: "column", md: "row" }}
      >
        <Box mb={{ base: 3, md: 0 }}>
          <Text mb={3}>
            {leave.daysOfWeekend} Weekends • {leave.daysOfPublicHolidays} Public
            Holidays
          </Text>
          {/* <Text mb={3} fontSize="sm" color="gray.600">
                      If you took leave from {dateFrom} till {dateTo}, you will
                      receive {leave.daysOfLeave} days of leave instead of 5!
                    </Text> */}
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
};

export default LeaveDayItem;
