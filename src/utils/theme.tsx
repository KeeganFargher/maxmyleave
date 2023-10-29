import { extendTheme } from "@chakra-ui/react";
import { CalendarDefaultTheme } from "@uselessdev/datepicker";

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

export default theme;