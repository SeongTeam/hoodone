"use client"
import React from 'react';
import { Box, Button, Container, Flex, Input, Stack, Textarea, VStack, Tag, TagRightIcon, TagLabel } from '@chakra-ui/react';
import TextEditor from './subComponent/textEditor';
import { customColors } from '@/utils/chakra/customColors';
import { NewPostForm } from '@/type/postType';
import { CloseIcon } from '@chakra-ui/icons';

/* TODO
- Input 스타일 css 파일로 적용하기
*/

type TextInputProps = {
    titlePlaceHolder: string;
    contentPlaceHolder: string;
    tagPlaceHolder: string;
    post : NewPostForm;
    setPost : React.Dispatch<React.SetStateAction<NewPostForm>>;
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
    const [inserting , setInserting] = React.useState<boolean>(false);

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
    const [tagSegment, setTagSegment] = React.useState<string>('');

    const removeTag = (target : string) => {
        setPost(prevPost => ({
            ...prevPost,
            tags : prevPost.tags.filter(tag => tag !== target)
        }));
    }

    const handleTagChange = ( event : React.ChangeEvent<HTMLInputElement> ) => {

        const segment = event.target.value;
        const lastCh = segment[segment.length - 1];


        switch(lastCh) {
            case '\n':
            case ' ':
                const newTag = segment.trim();
                if(newTag && !post.tags.includes(newTag)) {
                    setPost(prevPost => ({
                        ...prevPost,
                        tags : [...prevPost.tags, newTag]
                    }));
                    setTagSegment('');
                }
                else{
                    setTagSegment('');
                }
                break;
            default:
                setTagSegment(segment);
                break;
        }

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

                <Box
                    w= "100%"
                    id = "tagArea"
                >
                    {
                        post.tags && Array.isArray(post.tags) &&post.tags.map( (tag, index) => (
                            <Tag
                                key = {tag + index}
                                variant="postTag"
                                mr="5px"
                                mb="5px"
                                onClick={() => removeTag(tag)}
                                cursor="pointer"
                                _hover={{
                                    bg : customColors.gray[300]
                                }}
                            >
                                <TagLabel>#{tag}</TagLabel>
                                <TagRightIcon  
                                    boxSize="8px" 
                                    as={CloseIcon} 
                                    />
                            </Tag>
                        ))
                    }
                    <Box h="10px"/>
                    <Input
                        border={`1px solid ${inputBorderColor}`}
                        focusBorderColor={focusBorderColor}
                        borderRadius="8px"
                        color={fontColor}
                        name="tag"
                        value={tagSegment}
                        /**TODO Tage onChange logic 추가하기 */
                        onChange={handleTagChange}
                        placeholder={tagsPlaceHolder}
                        bg={bg}
                    />
                </Box>
            </VStack>
        </Box>
    );
};
export default TextInput;
