import React from 'react';
import { Box, Button, Container, Flex, Input, Stack, Textarea, VStack } from '@chakra-ui/react';
import TextEditor from './subComponent/textEditor';
import { customColors } from '@/utils/chakra/customColors';

/* TODO
- Input 스타일 css 파일로 적용하기
*/

type TextInputProps = {
    titlePlaceHolder: string;
    contentPlaceHolder: string;

    title: string;
    content: string;
    setTitle: (value: string) => void;
    setContent: (value: string) => void;
    isHidden: boolean;
};

const TextInput: React.FC<TextInputProps> = ({
    title = '',
    content = '',
    setTitle,
    setContent,
    isHidden,
    titlePlaceHolder,
    contentPlaceHolder,
}) => {
    // const bg = customColors.black[300];
    const fontColor = customColors.black[100];
    const bg = customColors.white;
    const inputBorderColor = customColors.shadeLavender[300];
    const focusBorderColor = customColors.skyBlue[100];

    const breakpoints = {
        base: '0em', // 0px
        sm: '30em', // ~480px. em is a relative unit and is dependant on the font-size.
        md: '48em', // ~768px
        lg: '62em', // ~992px
        xl: '80em', // ~1280px
        '2xl': '96em', // ~1536px
    };

    const handleEditorChange = (value: string) => {
        setContent(value);
    };

    return (
        <Box>
            <VStack
                // bg="red"
                alignContent="space-between"
                direction="column"
                hidden={isHidden}
                spacing="20px"
                // width={breakpoints}
            >
                <Input
                    border={`1px solid ${inputBorderColor}`}
                    borderRadius="8px"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={titlePlaceHolder}
                    bg={bg}
                />

                <Textarea
                    border={`1px solid ${inputBorderColor}`}
                    focusBorderColor={focusBorderColor}
                    color={fontColor}
                    placeholder={contentPlaceHolder}
                    height="200px"
                    name="content"
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                ></Textarea>
            </VStack>
        </Box>
    );
};
export default TextInput;
