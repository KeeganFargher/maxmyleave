import { extendTheme } from "@chakra-ui/react";
import { CalendarDefaultTheme } from "@uselessdev/datepicker";

const theme = extendTheme(CalendarDefaultTheme, {
  components: {
    Calendar: {
      parts: ["calendar", "months"],

      baseStyle: {
        calendar: {
          rounded: "6px",
          shadow: "none",
          border: "none", // hmm
          boxShadow: "none",
          fontWeight: "light",
          paddingRight: 0,
          p: 0,
        },
        months: {
          fontWeight: "light",
          padding: 0,

          w: "auto",
          gridTemplateColumns: "1fr 1fr",
        },
      },
    },
    CalendarControl: {
      parts: ["controls", "button"],
      baseStyle: {
        controls: {
          fontWeight: "light",
          padding: 0,
        },
        button: {
          fontWeight: "light",
        },
      },
    },
    CalendarDay: {
      baseStyle: {
        fontWeight: "light",
        rounded: "4px",
        bgColor: "transparent",

        _hover: {
          bgColor: "gray.100",
        },

        _disabled: {
          color: "gray.200",
          _hover: {
            cursor: "initial",
            bgColor: "transparent",
          },
        },
      },

      sizes: {
        sm: {
          h: 8,
        },
      },

      variants: {
        selected: {
          bgColor: "green.500",
          color: "white",
          _hover: {
            bgColor: "green.500",
          },
        },

        range: {
          bgColor: "gray.100",
          color: "black",
          _hover: {
            bgColor: "green.100",
          },
          _disabled: {
            _hover: {
              bgColor: "green.300",
            },
          },
        },

        outside: {
          color: "gray.300",
        },
        today: {
          bgColor: "green.100",
          _hover: {
            bgColor: "green.200",
          },
        },
      },

      defaultProps: {
        size: "sm",
      },
    },
    CalendarMonth: {
      parts: ["month", "name", "week", "weekday", "days"],
      baseStyle: {
        name: {
          fontWeight: "regular",
        },
      },
    },
  },
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
