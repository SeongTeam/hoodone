import type { ComponentStyleConfig } from '@chakra-ui/theme';
import { inputAnatomy } from '@chakra-ui/anatomy';
import { customColors } from '../customColors';

//refer https://chakra-ui.com/docs/styled-system/customize-theme
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/styled-system';

// refer https://chakra-ui.com/docs/components/input/theming
const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
    inputAnatomy.keys,
);

const baseStyle = definePartsStyle({
    field: {
        borderRadius: '15px',
    },
});

/* TODO
   - autofill 상태에서도 Input caret color 유지 필요
   - autofill 상태에서 color, bg 유지되도록 설정함
    ref : https://stackoverflow.com/questions/70809036/how-can-i-overwrite-styles-of-an-autofilled-input-when-using-chakra-ui

*/

const oauthFontSize = { base: '12px', lg: '16px' };

const oauth = definePartsStyle({
    field: {
        h: '60px',
        px: '10px',
        py: '10px',
        bg: customColors.shadeLavender[300],
        fontSize: { base: '12px', lg: '16px' },
        caretColor: customColors.black[300],

        _placeholder: {
            opacity: 0.4,
            color: customColors.black[300],
            fontSize: oauthFontSize,
        },

        _hover: {
            border: '1px solid',
            borderColor: customColors.shadeLavender[100],
        },

        _focus: {
            border: '1px solid',
            borderColor: customColors.shadeLavender[100],
        },

        _autofill: {
            transition: 'background-color 5000s ease-in-out 0s, color 0s 600000s',
        },
    },
});

const newPostFontSize = {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
};

const newPost = definePartsStyle({
    field: {
        w: '100%',
        h: '54px',
        bg: customColors.white[100],
        border: `1px solid ${customColors.shadeLavender[300]}`,
        _focus: { borderBlockColor: customColors.skyBlue[100], borderWidth: '2px' },
        fontSize: newPostFontSize,
        // _placeholder: { opacity: 0.4, color: '#FFFFFF', fontSize: newPostFontSize },
        _autofill: {
            transition: 'background-color 5000s ease-in-out 0s, color 0s 600000s',
        },
    },
});

const Input = defineMultiStyleConfig({
    baseStyle,
    variants: { oauth, newPost },
});

export default Input;
