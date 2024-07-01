import { Box, Button, HStack, Spacer, Tag, Text, VStack, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { type PostType } from '@/atoms/post';
import useSelectFile from '@/hooks/useSelectFile';
import TextInput from './postFormat/textInput';
import { userAccountState } from '@/atoms/userAccount';
import { customColors } from '@/utils/chakra/customColors';
import Tab, { type TabItem } from './tab';
import { createPosts } from '@/server-actions/postsActions';
import { AddIcon, AttachmentIcon } from '@chakra-ui/icons';

import { showErrorToast } from '@/components/modal/auth/components/toast/toast';
import { contentTexts, titleTexts } from './postFormat/const/texts';
import { uploadQuestImage } from '@/server-actions/postsActions';
import ImageUploadArea from '@/components/common/ImageUpload';

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
    const { selectedFile, setSelectedFile ,onSelectedFile, onDroppedFile } = useSelectFile();
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
                
                <ImageUploadArea
                    img={selectedFile}
                    setImg={setSelectedFile}
                    onInputImg={onSelectedFile}
                    onDropImg={onDroppedFile}

                />
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
