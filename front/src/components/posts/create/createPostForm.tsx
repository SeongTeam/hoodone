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
import { NEW_POST_FORMAT, POST_TYPE, NewPostForm, PostContainer, QuestPost, SubmissionPost } from '@/type/postType';
import { contentTexts, titleTexts } from '../card/const/rule_card_texts';
import { useRecoilState } from 'recoil';
import { UserAccountState } from '@/atoms/userAccount';
import { getCldImageUrl } from 'next-cloudinary';

type CreatePostFormProps = {
    type: POST_TYPE;
    existPost? : PostContainer<QuestPost | SubmissionPost> | null;
};

const CreatePostForm: React.FC<CreatePostFormProps> = ({ 
    type,
    existPost,
}) => {
    const userAccount = useUserAccountWithoutSSR(); 
    const router = useRouter();
    const useToastOption = useToast();
    const defaultNewPost : NewPostForm = existPost ? { 
        title: existPost.postData.title,
        content: existPost.postData.content,
        tags: existPost.postData.tags,
        type: type
    } : {
        title: '',
        content: '',
        tags: [],
        type: type,
    }
    const [newPost, setNewPost] = useState<NewPostForm>(defaultNewPost);
    const { selectedFile, setSelectedFile, onSelectedFile, onDroppedFile } = useSelectFile();
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

        const result = existPost ? await createPosts(formData, existPost.postData.id) : await createPosts(formData);
        console.log(result);
    };

    const convertUrlToFile = async (imgUrl : string) => {
        const fileName = 'questThumbnail'
        const res = await fetch(imgUrl);
        const blob = await res.blob();
        const file = new File([blob], fileName, { type: blob.type});
        setSelectedFile(file);
    }

    useEffect(() => {
        if(existPost){
            const publicId = existPost.postData.cloudinaryPublicId;
            if(publicId){
                const url = getCldImageUrl({ 

                    src : publicId});
                convertUrlToFile(url);
            }
    
        }
    },[])

    useEffect(() => {
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
                        variant="purple"
                        borderRadius="8px"
                        fontSize="20px"
                        width="100px"
                        py="20px"
                        px="15px"
                    >
                        {existPost ? 'Edit' : 'Create'}
                    </Button>
                    <Button
                        variant='cancel'
                        borderRadius="8px"
                        fontSize="20px"
                        width="100px"
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
