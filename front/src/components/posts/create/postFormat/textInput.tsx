"use client"
import React from 'react';
import { Box, Button, Container, Flex, Input, Stack, Textarea, VStack } from '@chakra-ui/react';
import TextEditor from './subComponent/textEditor';
import { customColors } from '@/utils/chakra/customColors';
import { NewPostFormType } from '@/type/postType';

/* TODO
- Input 스타일 css 파일로 적용하기
*/

type TextInputProps = {
    titlePlaceHolder: string;
    contentPlaceHolder: string;
    tagPlaceHolder: string;
    post : NewPostFormType;
    setPost : React.Dispatch<React.SetStateAction<NewPostFormType>>;
};

const TextInput: React.FC<TextInputProps> = ({
    titlePlaceHolder,
    contentPlaceHolder,
    tagPlaceHolder: tagsPlaceHolder,
    post,
    setPost
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

    const handleChange = ( event : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
        
        const property = event.target.name;
        const value = event.target.value;

        setPost( prev => ({
            ...prev,
            [property] : value
        }));

    } 


    return (
        <Box>
            <VStack
                // bg="red"
                alignContent="space-between"
                direction="column"
                spacing="20px"
                // width={breakpoints}
            >
                <Input
                    border={`1px solid ${inputBorderColor}`}
                    focusBorderColor={focusBorderColor}
                    borderRadius="8px"
                    color={fontColor}
                    name="title"
                    value={post.title}
                    onChange={handleChange}
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
                    onChange={handleChange}
                    value={post.content}
                ></Textarea>

                <Input
                    border={`1px solid ${inputBorderColor}`}
                    focusBorderColor={focusBorderColor}
                    borderRadius="8px"
                    color={fontColor}
                    name="tags"
                    value={post.tags}
                    /**TODO Tage onChange logic 추가하기 */
                    onChange={handleChange}
                    placeholder={tagsPlaceHolder}
                    bg={bg}
                />
            </VStack>
        </Box>
    );
};
export default TextInput;
