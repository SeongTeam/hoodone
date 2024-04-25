import { extendTheme } from "@chakra-ui/react";
import Button from "./componentStyle/button";
import Input from "./componentStyle/Inputs";
import { customColors } from "./customColors";

export const theme = extendTheme({
  styles: {
    global: {
      html: {
        fontSize: "16px",
        fontColor: customColors.white[100],
      },
    },
  },
  components: {
    Button,
    Input,
  },
});
