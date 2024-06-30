import { Box, Button, HStack, Spacer, Tag, Text, VStack, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { type PostType } from '@/atoms/post';
import useSelectFile from '@/hooks/useSelectFile';
import ImageUpload from './postFormat/imageUpload';
import TextInput from './postFormat/textInput';
import { userAccountState } from '@/atoms/userAccount';
import { customColors } from '@/utils/chakra/customColors';
import Tab, { type TabItem } from './tab';
import { createPosts } from '@/server-actions/postsActions';
import { AddIcon, AttachmentIcon } from '@chakra-ui/icons';

import { showErrorToast } from '@/components/modal/auth/components/toast/toast';
import { contentTexts, titleTexts } from '../card/const/rule_card_texts';

type CreatePostFormProps = {
    userAccount: userAccountState;
    communityImageURL?: string;
    isQuestPost: boolean;
};

const formTabs = [
    {
        ID: 'Post',
    },
    {
        ID: 'Thumbnail',
    },
];

const CreatePostForm: React.FC<CreatePostFormProps> = ({ userAccount, isQuestPost }) => {
    const useToastOption = useToast();
    const [selectedTab, setSelectTab] = useState(formTabs[0].ID);
    const [newPost, setNewPost] = useState<PostType>({
        title: '',
        content: '',
    } as PostType);
    const [tag, setTag] = useState<string>('');
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const { selectedFile, onSelectedFile, onDroppedFile } = useSelectFile();
    const [error, setError] = useState(false);
    const bg = customColors.white;
    const inputBorderColor = customColors.shadeLavender[300];

    const formTabsList = formTabs.map((item, index, array) => {
        let borderWidth = '0px 1px 1px 0px';

        if (index === array.length - 1) {
            borderWidth = '0px 0px 1px 0px';
        }

        return (
            <Tab
                key={item.ID}
                item={item}
                selected={item.ID === selectedTab}
                setSelectTab={setSelectTab}
                borderWidth={borderWidth}
            />
        );
    });

    const onSubmit = async () => {
        console.log('onSubmit()');
        const { title, content } = newPost;
        if (!title && title.length <= 0) {
            showErrorToast(useToastOption, { title: 'Title is empty!! ' });
            return;
        }

        if (!content && content.length <= 0) {
            showErrorToast(useToastOption, { title: 'Content is empty!! ' });
            return;
        }
        // const joinedTags: string = tags.join(' ');
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('tags', tag);
        formData.append('isQuest', `${isQuestPost}`);

        const result = await createPosts(formData);
        console.log(result);
    };

    return (
        <Box>
            <VStack
                align="stretch"
                spacing="20px"
                width="100%"
                py="20px"
                px="12px"
                direction="column"
                bg={bg}
                borderRadius="15px"
                border={`1px solid ${inputBorderColor}`}
            >
                <form action={createPosts}>
                    <TextInput
                        titlePlaceHolder={isQuestPost ? titleTexts.quest : titleTexts.sb}
                        contentPlaceHolder={isQuestPost ? contentTexts.quest : contentTexts.sb}
                        tagPlaceHolder="write tag"
                        isHidden={selectedTab !== 'Post'}
                        title={newPost.title}
                        content={newPost.content}
                        tag={tag}
                        setTitle={(value: string) => {
                            setNewPost((prev) => ({ ...prev, title: value }));
                        }}
                        setContent={(value: string) => {
                            setNewPost((prev) => ({ ...prev, content: value }));
                        }}
                        setTag={(tag: string) => {
                            const tagList = tag.split(' ');
                            setTag(() => tag);
                        }}
                    />
                </form>
                <HStack
                    py="17px"
                    px="59px"
                    spacing="40px"
                    borderRadius="15px"
                    border={`1px solid ${inputBorderColor}`}
                    alignContent="center"
                    align="center"
                >
                    <Button
                        bg="#ebedf0"
                        _hover={{ bg: customColors.white[300] }}
                        borderRadius="15px"
                        width={{ lg: '40%' }}
                        minHeight={{ sm: '250px' }}
                    >
                        <VStack alignContent="center" direction="column">
                            {/* <AddIcon boxSize={8} mb="4px" color="black" /> */}
                            /**TODO 피그마와 다른 아이콘 사용 */
                            <AttachmentIcon boxSize={8} mb="4px" color="black" />
                            <Text
                                mt="4px"
                                noOfLines={2}
                                fontSize="18px"
                                color="black"
                                whiteSpace="pre-line"
                            >
                                UpLoad Media File *.jpeg, *.png
                            </Text>
                        </VStack>
                    </Button>
                    <Box width={{ lg: '45%' }} minHeight={{ sm: '250px' }} alignContent="center">
                        <Text
                            mt="4px"
                            noOfLines={3}
                            fontSize="24px"
                            color="black"
                            whiteSpace="pre-line"
                        >
                            Freely Upload Image file. Not need to be related to your quest
                        </Text>
                        <Spacer height="12px"></Spacer>
                        <Button
                            bg={customColors.purple[100]}
                            _hover={{ bg: customColors.white[300] }}
                            borderRadius="8px"
                            fontSize="20px"
                            py="20px"
                            px="15px"
                        >
                            Upload
                        </Button>
                    </Box>
                </HStack>

                <HStack spacing="20px">
                    <Button
                        onClick={() => {
                            onSubmit();
                        }}
                        bg={customColors.purple[100]}
                        _hover={{ bg: customColors.white[300] }}
                        borderRadius="8px"
                        fontSize="20px"
                        py="20px"
                        px="15px"
                    >
                        Create
                    </Button>
                    <Button
                        bg={customColors.red[100]}
                        _hover={{ bg: customColors.white[300] }}
                        borderRadius="8px"
                        fontSize="20px"
                        py="20px"
                        px="15px"
                    >
                        Cancel
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};
export default CreatePostForm;
