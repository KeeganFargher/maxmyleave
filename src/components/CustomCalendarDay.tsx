import * as React from "react";
import {
  Box,
  Button,
  ButtonProps,
  Circle,
  Text,
  useStyleConfig,
} from "@chakra-ui/react";
import { useCalendarDay } from "@uselessdev/datepicker";
import { format } from "date-fns";

export type CalendarDay = {
  isPublicHoliday?: false;
} & React.PropsWithChildren<ButtonProps>;

export function CustomCalendarDay({
  children,
  isPublicHoliday,
  ...props
}: CalendarDay) {
  const { day, interval, variant, isDisabled, onSelectDates } =
    useCalendarDay();
  const styles = useStyleConfig("CalendarDay", { variant, interval });

  return (
    <Button
      aria-current={variant === "selected" ? "date" : false}
      aria-label={format(day, "MM-d")}
      onClick={() => onSelectDates(day)}
      isDisabled={isDisabled}
      sx={{ ...styles, ...props }}
      {...props}
    >
      <Box
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
      >
        <Text>{children || format(day, "d")}</Text>
        {isPublicHoliday && <Circle size="4px" bgColor="pink.300" />}
      </Box>
    </Button>
  );
}
