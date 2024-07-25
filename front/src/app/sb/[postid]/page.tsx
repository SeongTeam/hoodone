import { NextPage } from 'next';
import { POST_TYPE, PostContainer, QuestPost, SubmissionPost } from '@/components/posts/postType';
import { PostFetchService } from '@/components/posts/postLib';
import { Box, Text, Spacer, Flex, Grid, VStack, SimpleGrid, Image } from '@chakra-ui/react';
import logger from '@/utils/log/logger';
import { customColors } from '@/utils/chakra/customColors';
import RuleCard from '@/components/posts/card/RuleCard';
import CommentArea from '@/components/comment/server-component/commentArea';
import DetailPostForm from '@/components/posts/detail/detailPostForm';
import { questPostRuleText } from '@/components/posts/card/const/rule_card_texts';
import dynamic from 'next/dynamic';
import MiniPostCard from '@/components/posts/card/MiniPostCard';
import { ImageUploadVariant } from '@/components/common/ImageUpload';
import { notFound } from 'next/navigation';
const PostSlider = dynamic(() => import('@/components/common/postSlider'), { ssr: false });

export type SbPageProps = {
    params: {
        postid: string;
    };
    searchParams: {
        index: string;
    };
};

const SbPage: NextPage<SbPageProps> = async ({ params, searchParams }) => {
    const borderColor = customColors.shadeLavender[300];

    logger.info('#SubmissionPage Rendered', { message: params.postid });
    console.log(params.postid, searchParams.index);

    const sbService = new PostFetchService(POST_TYPE.SB);
    const qeustService = new PostFetchService(POST_TYPE.QUEST);

    const sb = await sbService.getPostByID(
        params.postid,
        parseInt(searchParams.index),
    ) as PostContainer<SubmissionPost>;


    if (!sb) {
        logger.error(`sb ${params.postid} not found`);
        notFound();
    }

    const parentQuest : PostContainer<QuestPost> ={
        postData: sb.postData.parentPost,
        paginatedOffset: 0,
        lastFetched: new Date(),
    };
    const relatedSbs = await qeustService.getRelatedsbs(parentQuest.postData.id.toString());



    return (
        <Box
            w="full"
            h="full"
            pt="20px"
            px={{ sm: '4px', md: '14px', lg: '29px' }}
            // pt={{ sm: '12px', md: '25px' }}
            bg={customColors.pageBackGround}
        >
            <Text pl="8px" pb="2px" size="17px">
                Submission
            </Text>
            <Flex
                flexDirection="column"
                // pt={{ base: '120px', md: '75px' }}
                // px={{ sm: '4px', md: '14px', lg: '29px' }}
                // pt={{ sm: '12px', md: '25px' }}
                pb="20px"
                minW="300px"
            >
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
                            bg="white"
                            align="left"
                            px={{ sm: '0', md: '14px', lg: '24px' }}
                            py="24px"
                            borderRadius="15px"
                            border={`1px solid ${borderColor}`}
                        >
                            <DetailPostForm type={POST_TYPE.SB} post={sb} parentPost={parentQuest}></DetailPostForm>

                            <Box h="16px" />

                            <Text fontSize="1.4em"> Submission</Text>
                            <PostSlider sliderName="sbsPostsOnDetail" height="190px">
                                {Array.isArray(relatedSbs) && relatedSbs?.map((s, index) => (
                                    <MiniPostCard key={index} index={index} post={s} />
                                ))}
                            </PostSlider>

                            <Spacer h="26px" />

                            <CommentArea postType={POST_TYPE.SB} postID={sb.postData.id}></CommentArea>
                        </VStack>

                        <RuleCard
                            title="Quest"
                            cardTexts={questPostRuleText}
                            displayOption={{ md: 'none', lg: 'none', xl: 'block' }}
                        ></RuleCard>
                    </Grid>
                </SimpleGrid>
            </Flex>
        </Box>
    );
};

export default SbPage;
