import * as React from "react";
import {
  Box,
  Button,
  ButtonProps,
  Circle,
  Text,
  useStyleConfig,
  Tooltip,
} from "@chakra-ui/react";
import { useCalendarDay } from "@uselessdev/datepicker";
import { format } from "date-fns";

export type CalendarDay = {
  isPublicHoliday?: boolean;
  holidayName?: string;
  holidayColor?: string;
} & React.PropsWithChildren<ButtonProps>;

export function CustomCalendarDay({
  children,
  isPublicHoliday = false,
  holidayName,
  holidayColor = "pink.400",
  ...props
}: CalendarDay) {
  const { day, interval, variant, isDisabled, onSelectDates } =
    useCalendarDay();
  const styles = useStyleConfig("CalendarDay", { variant, interval });

  const calendarDayContent = (
    <Box
      display="flex"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
    >
      <Text>{children || format(day, "d")}</Text>
      {isPublicHoliday && <Circle size="5px" bgColor={holidayColor} mt="2px" />}
    </Box>
  );

  return (
    <Button
      aria-current={variant === "selected" ? "date" : false}
      aria-label={format(day, "MM-d")}
      onClick={() => onSelectDates(day)}
      isDisabled={isDisabled}
      sx={{ ...styles, ...props }}
      {...props}
    >
      {holidayName && isPublicHoliday ? (
        <Tooltip label={holidayName} placement="top" hasArrow>
          {calendarDayContent}
        </Tooltip>
      ) : (
        calendarDayContent
      )}
    </Button>
  );
}
