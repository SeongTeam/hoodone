import { Heading, extendTheme } from '@chakra-ui/react';
import Button from './componentStyle/button';
import Input from './componentStyle/Inputs';
import Tag from './componentStyle/tag';
import { customColors } from './customColors';
import colorModeConfig from './foundations/colorMode';
import { fonts } from './foundations/fonts';

export const theme = extendTheme({
    config: colorModeConfig,
    fonts: {
        Heading: fonts.lato.style.fontFamily,
        body: fonts.roboto.style.fontFamily,
    },
    styles: {
        global: {
            html: {
                fontSize: '16px',
                fontColor: customColors.white[100],
            },
        },
    },
    components: {
        Button,
        Input,
        Tag,
    },
});
