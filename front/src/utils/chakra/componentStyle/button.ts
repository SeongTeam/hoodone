import type { ComponentStyleConfig } from "@chakra-ui/theme";
import { customColors } from "../customColors";
import { basicFontSize as oauthFontSize } from "../fonts";

const Button: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: "15px",
    fontSize: "1.25rem",
    fontWeight: 700,
    border: "1px solid",
    borderColor: customColors.strokeColor[100],
    _focus: {
      boxShadow: "none",
    },
  },
  variants: {
    solid: {
      color: customColors.white[100],
      bg: customColors.buttonColor[100],
      _hover: {
        bg: "blue.400",
      },
    },
    outline: {
      color: "blue.500",
      border: "1px solid",
      borderColor: "blue.500",
    },
    oauth: {
      maxW: "190px",
      maxH: "70px",
      px: "2rem",
      py: "2rem",
      bg: customColors.buttonColor[100],
      fontSize: oauthFontSize,
    },
  },
};

export default Button;
