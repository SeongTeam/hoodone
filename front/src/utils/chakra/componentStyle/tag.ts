import { tagAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';
import { customColors } from '../customColors';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(tagAnatomy.keys);

const postTag = definePartsStyle({
    container: {
        size: 'lg',
        maxW: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        bg: customColors.shadeLavender[300],
        py: '5px',
    },
});

const Tag = defineMultiStyleConfig({ variants: { postTag } });

export default Tag;
