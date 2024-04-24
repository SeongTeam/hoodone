import { extendTheme } from "@chakra-ui/react";
import Button from "./componentStyle/button";
import Input from "./componentStyle/Inputs";

export const theme = extendTheme({
  colors: {
    bg: {
      100: "#242424",
      200: "#7B889B",
    },
  },
  components: {
    Button,
    Input,
  },
});
