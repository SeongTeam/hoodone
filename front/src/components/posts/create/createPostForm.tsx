"use client";
import { Box, Button, HStack, Spacer, Tag, Text, VStack, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useSelectFile from '@/hooks/useSelectFile';
import TextInput from './postFormat/textInput';
import { customColors } from '@/utils/chakra/customColors';
import Tab, { type TabItem } from './tab';
import { createPosts } from '@/server-actions/postsActions';
import { AddIcon, AttachmentIcon } from '@chakra-ui/icons';

import { showErrorToast } from '@/components/modal/auth/components/toast/toast';
import { contentTexts, titleTexts } from './postFormat/const/texts';
import { uploadQuestImage } from '@/server-actions/postsActions';
import ImageUploadArea from '@/components/common/ImageUpload';
import { useUserAccountWithSSR } from '@/hooks/userAccount';
import { NEW_POST_FORMAT,POST_TYPE, NewPostFormType, tagDelimiter } from '@/type/postType';



type CreatePostFormProps = {
    type: POST_TYPE;
};

const CreatePostForm: React.FC<CreatePostFormProps> = ({  type = POST_TYPE.QUEST }) => {
    const [ userAccount ] = useUserAccountWithSSR(); //사용자가 브라우저 자원을 훼손할 여지가 있으므로, accessToken을 통해 서버에서 직접 정보를 가져오기
    const router = useRouter();
    const useToastOption = useToast();
    const [newPost, setNewPost] = useState<NewPostFormType>({
        title: '',
        content: '',
        tags: [],
        type : type
    } as NewPostFormType);
    const { selectedFile, setSelectedFile ,onSelectedFile, onDroppedFile } = useSelectFile();
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

        if(selectedFile) {
            formData.append(NEW_POST_FORMAT.IMAGE, selectedFile);
        }

        const result = await createPosts(formData);
        console.log(result);
    };

    useEffect(() => {
        /*TODO
        - check login State
        if(!userAccount.isLogin){
            alert('pleae login first');
            router.push('/login');
        }
        */
    },[])

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
                        post = {newPost}
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
