import type { ComponentStyleConfig } from "@chakra-ui/theme";

const Button: ComponentStyleConfig = {
  baseStyle: {
    borderRadius: "15px",
    fontSize: "20px",
    fontWeight: 700,
    border: "1px solid",
    borderColor: "#7B889B",
    _focus: {
      boxShadow: "none",
    },
  },
  sizes: {
    sm: {
      fontSize: "12px",
    },
    md: {
      fontSize: "16px",
      // height: "28px",
    },
    xl: {
      fontSize: "20px",
    },
  },
  variants: {
    solid: {
      color: "white",
      bg: "#4E6D90",
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
      w: "190px",
      h: "70px",
      bg: "#4E6D90",
      fontSize: "32px",
    },
  },
};

export default Button;
