import type { ComponentStyleConfig } from "@chakra-ui/theme";
import { inputAnatomy } from "@chakra-ui/anatomy";
import { customColors } from "../customColors";

//refer https://chakra-ui.com/docs/styled-system/customize-theme
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from "@chakra-ui/styled-system";

// refer https://chakra-ui.com/docs/components/input/theming
const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const baseStyle = definePartsStyle({
  field: {
    caretColor: customColors.white[300],
    borderRadius: "15px",
    color: customColors.white[100],
    border: "1px solid",
    borderColor: customColors.strokeColor[100],
  },
});

/* TODO
   - autofill 상태에서도 Input caret color 유지 필요
   - autofill 상태에서 color, bg 유지되도록 설정함
    ref : https://stackoverflow.com/questions/70809036/how-can-i-overwrite-styles-of-an-autofilled-input-when-using-chakra-ui

*/

const oauthFontSize = {
  sm: "1rem",
  md: "1.25rem",
  lg: "1.5rem",
  xl: "1.75rem",
  "2xl": "2rem",
};
const oauth = definePartsStyle({
  field: {
    w: "592px",
    h: "80px",
    px: "1rem",
    py: "1rem",
    bg: customColors.black[300],
    fontSize: oauthFontSize,
    _placeholder: {
      opacity: 0.4,
      color: customColors.white[300],
      fontSize: oauthFontSize,
    },
    _autofill: {
      transition: "background-color 5000s ease-in-out 0s, color 0s 600000s",
    },
  },
});

const newPostFontSize = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
};

const newPost = definePartsStyle({
  field: {
    w: "100%",
    h: "54px",
    bg: customColors.black[300],
    fontSize: newPostFontSize,
    _placeholder: { opacity: 0.4, color: "#FFFFFF", fontSize: newPostFontSize },
    _autofill: {
      transition: "background-color 5000s ease-in-out 0s, color 0s 600000s",
    },
  },
});

const Input = defineMultiStyleConfig({
  baseStyle,
  variants: { oauth, newPost },
});

export default Input;
