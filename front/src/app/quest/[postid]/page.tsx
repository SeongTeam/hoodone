import { NextPage } from 'next';
import { POST_TYPE } from '@/components/posts/postType';
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
import { PostFetchService } from '@/components/posts/postLib';
import { notFound } from 'next/navigation';
const PostSlider = dynamic(() => import('@/components/common/postSlider'), { ssr: false });

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
    const questFetchService = new PostFetchService(POST_TYPE.QUEST);

    logger.info('#PostPage Rendered', { message: params.postid });
    console.log(params.postid, searchParams.index);

    const postPromise = questFetchService.getPostByID(
        params.postid,
        parseInt(searchParams.index),
    );

    const relatedSblistPromise = questFetchService.getRelatedsbs(params.postid);

    const [post, relatedSblist] = await Promise.all([postPromise, relatedSblistPromise]);

    if (!post) {
        logger.error(`post${params.postid} not found`);
        notFound();
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
                        <DetailPostForm type={POST_TYPE.QUEST} post={post}></DetailPostForm>

                        <Spacer h="6px" />

                        <Text fontSize="1.4em"> Submission</Text>
                        <PostSlider sliderName="sbsPostsOnDetail" height="190px">
                            {relatedSblist?.map((sb, index) => (
                                <MiniPostCard key={index} index={index} post={sb} />
                            ))}
                        </PostSlider>

                        <Spacer h="26px" />

                        <CommentArea postType={POST_TYPE.QUEST} postID={post.postData.id}></CommentArea>
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
