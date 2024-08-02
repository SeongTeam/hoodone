import { Box, Grid, GridItem, HStack, Spacer, Stack, VStack, Text } from '@chakra-ui/react';
import CreatePostForm from '@/components/posts/create/createPostForm';
import { customColors } from '@/utils/chakra/customColors';
import CreationRulesBox from '@/components/posts/create/postFormat/subComponent/creationRulesBox';
import { POST_TYPE } from '@/components/posts/postType';
import { NextPage } from 'next';
import { PostFetchService } from '@/components/posts/postLib';
import ParentPostCard from '@/components/posts/detail/components/ParentPostCard';
import { Logger } from 'winston';
import logger from '@/utils/log/logger';

interface CreateSbPageProps {
    params: {
        questId : string
    }
    searchParams: {
        index: string
    }
}

 const CreateSbPage : NextPage<CreateSbPageProps> =async  ({ params, searchParams }) => {
    const noPos = 0;
    const parentQuestId = params.questId;
    const pos = parseInt(searchParams.index) ?? noPos;
    const questPost = await new PostFetchService(POST_TYPE.QUEST).getPostByID( parentQuestId, pos );
    if (!questPost) {
        logger.error(`Quest post not found ${parentQuestId}`, { questPost: JSON.stringify(params) });
        throw new ReferenceError(`post not found`);
    }
    
    return (
        <Box width="100%" pb="20px">
                    <ParentPostCard post={questPost} type={POST_TYPE.QUEST} />
                    <CreatePostForm type={POST_TYPE.SB} />

        </Box>
    );
}

export default CreateSbPage;
