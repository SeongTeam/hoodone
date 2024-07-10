import { NextPage } from "next";
import { PostFetchService } from "@/lib/server-only/postLib";
import { POST_TYPE, PostType } from '@/type/postType';
import { Grid,SimpleGrid,Spacer,Text, VStack } from "@chakra-ui/react";
import logger from "@/utils/log/logger";
import RuleCard from "@/components/posts/card/RuleCard";
import DetailPostForm from "@/components/posts/detail/detailPostForm";
import PostSlider from "@/components/_global/slider/postSlider";
import MiniPostCard from "@/components/posts/card/MiniPostCard";
import { questPostRuleText } from "@/components/posts/card/const/rule_card_texts";
import { customColors } from "@/utils/chakra/customColors";
import CommentArea from "@/components/comment/server-component/commentArea";
type PostPageWithReplyProps = {
    params: {
        postid: string,
        commentid : string
    }
    searchParams: {
        index: string,
    }
}
const PostPageWithReply : NextPage<PostPageWithReplyProps> = async (
{
    params,
    searchParams
}
) => {
    const inputBorderColor = customColors.shadeLavender[300];

    const postService = new PostFetchService(POST_TYPE.SB);
    const post : PostType | null = await postService.getPostByID(params.postid, parseInt(searchParams.index));
    
    const allPosts: PostType[] | null = await postService.getCachedPaginatedPosts(1);

    logger.info('#PostPageWithReply Rendered', { message: JSON.stringify(params) });
    if(!post ) {
        logger.error(`post${params.postid} not found`);
        throw new ReferenceError(`post not found`);
    }

    return (
        <SimpleGrid columns={{ sm: 1, md: 1 }} spacing="24px">
        <Grid
            templateColumns={{ md: '1fr', lg: '1fr', xl: '3fr 1fr' }}
            templateRows={{ sm: '1fr auto', md: '2fr' }}
            gap="24px"
        >
            <RuleCard
                title="Quest"
                cardTexts={questPostRuleText}
                displayOption={{ sm: 'block', md: 'block', lg: 'block', xl: 'none' }}
            ></RuleCard>
            <VStack
                w="100%"
                minW="300px"
                bg="FFFFFF"
                align="left"
                px={{ sm: '0', md: '14px', lg: '24px' }}
                py="24px"
                borderRadius="15px"
                border={`1px solid ${inputBorderColor}`}
            >
                <DetailPostForm type= {POST_TYPE.SB} post={post}></DetailPostForm>

                <Spacer h="6px" />

                <Text fontSize="1.4em"> Submission</Text>
                <PostSlider sliderName="sbsPostsOnDetail" hight="190px">
                    {allPosts?.map((post, index) => (
                        <MiniPostCard key={index} index={index} post={post} />
                    ))}
                </PostSlider>

                <Spacer h="26px" />

                <CommentArea postType={POST_TYPE.SB} postID={post.id} rootCommentID={parseInt(params.commentid)}></CommentArea>
            </VStack>
            <RuleCard
                title="Quest"
                cardTexts={questPostRuleText}
                displayOption={{ md: 'none', lg: 'none', xl: 'block' }}
            ></RuleCard>
        </Grid>
    </SimpleGrid>
    );



}

export default PostPageWithReply;