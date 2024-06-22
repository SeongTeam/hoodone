import React from 'react';
import { Box, Button, Container, Flex, Input, Stack, Textarea, VStack } from '@chakra-ui/react';
import TextEditor from './subComponent/textEditor';
import { customColors } from '@/utils/chakra/customColors';

/* TODO
- Input 스타일 css 파일로 적용하기
*/

type TextInputProps = {
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
}) => {
    // const bg = customColors.black[300];
    const fontColor = customColors.black[100];
    const bg = customColors.white;
    const inputBorderColor = customColors.shadeLavender[300];
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
                    variant="newPost"
                    border={`1px solid ${inputBorderColor}`}
                    name="title"
                    // fontStyle={{ color: 'black' }}
                    color={fontColor}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Quest Title:Do Something"
                    _placeholder={{ color: 'black.200', fontsize: '' }}
                    bg={bg}
                    width="100%"
                />

                <Textarea
                    border={`1px solid ${inputBorderColor}`}
                    // hidden={true}
                    color={fontColor}
                    placeholder="Freely leave content"
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
