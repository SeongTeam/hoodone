import { NextPage } from 'next';
import { POST_TYPE, PostType } from '@/type/postType';
import { Box, Text, Spacer, Flex, Grid, VStack, SimpleGrid, Image } from '@chakra-ui/react';
import logger from '@/utils/log/logger';
import { customColors } from '@/utils/chakra/customColors';
import { userAccountState } from '@/atoms/userAccount';
import RuleCard from '@/components/posts/card/RuleCard';
import CommentArea from '@/components/comment/server-component/commentArea';
import DetailPostForm from '@/components/posts/detail/detailPostForm';
import { questPostRuleText } from '@/components/posts/card/const/rule_card_texts';
import dynamic from 'next/dynamic';
import MiniPostCard from '@/components/posts/card/MiniPostCard';
import { PostFetchService } from '@/lib/server-only/postLib';
const PostSlider = dynamic(() => import('@/components/_global/slider/postSlider'), { ssr: false });

export type QuestPageProps = {
    params: {
        postid: string;
        rootCommentID?: number;
    };
    searchParams: {
        index: string;
    };
};

const QuestPage: NextPage<QuestPageProps> = async ({ params, searchParams }) => {
    const inputBorderColor = customColors.shadeLavender[300];
    const postFetchService = new PostFetchService(POST_TYPE.QUEST);

    logger.info('#PostPage Rendered', { message: params.postid });
    console.log(params.postid, searchParams.index);

    const post: PostType | null = await postFetchService.getPostByID(params.postid, parseInt(searchParams.index));

    const allPosts: PostType[] | null = await postFetchService.getCachedPaginatedPosts(1);
    if (!post) {
        logger.error(`post${params.postid} not found`);
        throw new ReferenceError(`post not found`);
    }
    return (
        <Flex
            flexDirection="column"
            // pt={{ base: '120px', md: '75px' }}
            px={{ sm: '4px', md: '14px', lg: '29px' }}
            pt={{ sm: '12px', md: '25px' }}
            pb="20px"
            minW="300px"
        >
            <Text size="17px">User Quest</Text>
            <Spacer height="11px" />
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
                        <DetailPostForm type= {POST_TYPE.QUEST} post={post}></DetailPostForm>

                        <Spacer h="6px" />

                        <Text fontSize="1.4em"> Submission</Text>
                        <PostSlider sliderName="sbsPostsOnDetail" hight="190px">
                            {allPosts?.map((post, index) => (
                                <MiniPostCard key={index} index={index} post={post} />
                            ))}
                        </PostSlider>

                        <Spacer h="26px" />

                        <CommentArea postType={POST_TYPE.QUEST} postID={post.id}></CommentArea>
                    </VStack>
                    <RuleCard
                        title="Quest"
                        cardTexts={questPostRuleText}
                        displayOption={{ md: 'none', lg: 'none', xl: 'block' }}
                    ></RuleCard>
                </Grid>
            </SimpleGrid>
        </Flex>
    );
};

export default QuestPage;
