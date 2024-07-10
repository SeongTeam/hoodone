import type { ComponentStyleConfig } from '@chakra-ui/theme';
import { customColors } from '../customColors';
import { basicFontSize as oauthFontSize } from '../foundations/fonts';

const Button: ComponentStyleConfig = {
    baseStyle: {
        borderRadius: '15px',
        fontSize: '20px',
        py: '20px',
        px: '15px',
        fontWeight: 700,
        _focus: {
            boxShadow: 'none',
        },
    },
    variants: {
        solid: {
            color: customColors.white[100],
            bg: customColors.buttonColor[100],
            _hover: {
                bg: 'blue.400',
            },
        },
        outline: {
            color: 'blue.500',
            border: '1px solid',
            borderColor: 'blue.500',
        },
        disable: {
            bg: customColors.gray[200],
            _hover: {
                bg: customColors.gray[200],
            },
        },
        purple: {
            color: customColors.white[100],
            bg: customColors.purple[100],
            _hover: { bg: customColors.purple[200] },
        },
        cancel: {
            color: customColors.white[100],
            bg: customColors.red[100],
            _hover: { bg: customColors.red[200] },
        },
    },
};

export default Button;
