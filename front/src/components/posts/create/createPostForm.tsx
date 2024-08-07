'use client';

import { Box, Button, HStack, VStack, useToast } from '@chakra-ui/react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import useSelectFile from '@/hooks/useSelectFile';
import TextInput from './postFormat/textInput';
import { customColors } from '@/utils/chakra/customColors';
import { createPosts } from '@/components/posts/postsActions';
import { showErrorToast } from '@/components/authentication/components/toast';
import ImageUploadArea from '@/components/common/ImageUpload';
import { useUserAccountWithoutSSR } from '@/hooks/userAccount';
import { NEW_POST_FORMAT, POST_TYPE, NewPostForm, PostContainer, QuestPost, SubmissionPost } from '@/components/posts/postType';
import { contentTexts, titleTexts } from '../card/const/rule_card_texts';
import { useRecoilState } from 'recoil';
import { UserAccountState } from '@/atoms/userAccount';
import { getCldImageUrl } from 'next-cloudinary';
import { RouteTable } from '@/components/sidebar/SideBarRoute';

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
    const isQuestPost = type === POST_TYPE.QUEST;
    const params = useParams<{ questId: string}>() || null;
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
        parentQuestId : !isQuestPost ? params?.questId : undefined,
    }
    const [newPost, setNewPost] = useState<NewPostForm>(defaultNewPost);
    const { selectedFile, setSelectedFile, onSelectedFile, onDroppedFile } = useSelectFile();
    const bg = customColors.white[100];
    const inputBorderColor = customColors.shadeLavender[300];



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

    const convertUrlToFile = useCallback( async (imgUrl : string) => {
        const fileName = 'questThumbnail'
        const res = await fetch(imgUrl);
        const blob = await res.blob();
        const file = new File([blob], fileName, { type: blob.type});
        setSelectedFile(file);
    }, [setSelectedFile]);

    useEffect(() => {
        if(existPost){
            const publicId = existPost.postData.cloudinaryPublicId;
            if(publicId){
                const url = getCldImageUrl({ 

                    src : publicId});
                convertUrlToFile(url);
            }
    
        }
    },[existPost,convertUrlToFile])

    useEffect(() => {
        if(!userAccount.isLogin){
            alert('pleae login first');
            router.push(RouteTable.authRoute.signIn);
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
