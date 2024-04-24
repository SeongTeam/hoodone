import type { ComponentStyleConfig } from "@chakra-ui/theme";
import { inputAnatomy } from "@chakra-ui/anatomy";

//refer https://chakra-ui.com/docs/styled-system/customize-theme
import {
  createMultiStyleConfigHelpers,
  defineStyle,
} from "@chakra-ui/styled-system";

// refer https://chakra-ui.com/docs/components/input/theming
const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

const fontColor = "gray.300";
const caretColor = "gray.500";

const baseStyle = definePartsStyle({
  field: {
    caretColor: caretColor,
    borderRadius: "15px",
    color: fontColor,
    fontSize: "28px",
    border: "1px solid",
    borderColor: "#7B889B",
  },
});

const xl = defineStyle({
  fontSize: "24px",
  px: "5px",
  h: "30px",
});

/* TODO
   - autofill 상태에서도 Input caret color 유지 필요
   - autofill 상태에서 color, bg 유지되도록 설정함
    ref : https://stackoverflow.com/questions/70809036/how-can-i-overwrite-styles-of-an-autofilled-input-when-using-chakra-ui

*/
const oauth = definePartsStyle({
  field: {
    w: "592px",
    h: "80px",
    bg: "#242424",
    fontSize: "32px",
    _placeholder: { opacity: 0.4, color: "#FFFFFF", fontSize: "32px" },
    _autofill: {
      transition: "background-color 5000s ease-in-out 0s, color 0s 600000s",
    },
  },
});

const newPost = definePartsStyle({
  field: {
    w: "100%",
    h: "54px",
    bg: "#242424",
    fontSize: "24px",
    _placeholder: { opacity: 0.4, color: "#FFFFFF", fontSize: "24px" },
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
