'use client';

import { Box, Button, HStack, VStack, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useSelectFile from '@/hooks/useSelectFile';
import TextInput from './postFormat/textInput';
import { customColors } from '@/utils/chakra/customColors';
import Tab, { type TabItem } from './tab';
import { createPosts } from '@/server-actions/postsActions';
import { showErrorToast } from '@/components/modal/auth/components/toast/toast';
import ImageUploadArea from '@/components/common/ImageUpload';
import { useUserAccountWithoutSSR } from '@/hooks/userAccount';
import { NEW_POST_FORMAT, POST_TYPE, NewPostFormType, tagDelimiter } from '@/type/postType';
import { contentTexts, titleTexts } from '../card/const/rule_card_texts';
import { useRecoilState } from 'recoil';
import { UserAccountState } from '@/atoms/userAccount';

type CreatePostFormProps = {
    type: POST_TYPE;
};

const CreatePostForm: React.FC<CreatePostFormProps> = ({ type = POST_TYPE.QUEST }) => {
    const userAccount = useUserAccountWithoutSSR(); 
    const router = useRouter();
    const useToastOption = useToast();
    const [newPost, setNewPost] = useState<NewPostFormType>({
        title: '',
        content: '',
        tags: [],
        type: type,
    } as NewPostFormType);
    const { selectedFile, setSelectedFile, onSelectedFile, onDroppedFile } = useSelectFile();
    const [error, setError] = useState(false);
    const bg = customColors.white[100];
    const inputBorderColor = customColors.shadeLavender[300];
    const isQuestPost = type === POST_TYPE.QUEST;

    const onSubmit = async () => {
        console.log('onSubmit()');
        if (!newPost.title && newPost.title.length <= 0) {
            showErrorToast(useToastOption, { title: 'Title is empty!! ' });
            return;
        }

        if (!newPost.content && newPost.content.length <= 0) {
            showErrorToast(useToastOption, { title: 'Content is empty!! ' });
            return;
        }

        const formData = new FormData();
        formData.append(NEW_POST_FORMAT.POST_DTO, JSON.stringify(newPost));

        if (selectedFile) {
            formData.append(NEW_POST_FORMAT.IMAGE, selectedFile);
        }

        const result = await createPosts(formData);
        console.log(result);
    };


    useEffect(() => {
        console.log('LoginStatus : ',userAccount.isLogin);
        if(!userAccount.isLogin){
            alert('pleae login first');
            router.push('/authentication/sign-in');
        }
    },[userAccount.isLogin,router]);

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
                <form>
                    <TextInput
                        titlePlaceHolder={isQuestPost ? titleTexts.quest : titleTexts.sb}
                        contentPlaceHolder={isQuestPost ? contentTexts.quest : contentTexts.sb}
                        tagPlaceHolder="write tag"
                        post={newPost}
                        setPost={setNewPost}
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
