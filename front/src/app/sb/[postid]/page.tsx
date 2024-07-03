import { NextPage } from 'next';
import { PostType } from '@/type/postType';
import { getAllPosts, getPostWithID } from '@/lib/server-only/postLib';
import { Box, Text, Spacer, Flex, Grid, VStack, SimpleGrid, Image } from '@chakra-ui/react';
import logger from '@/utils/log/logger';
import { customColors } from '@/utils/chakra/customColors';
import { useUserAccountWithSSR } from '@/hooks/userAccount';
import { userAccountState } from '@/atoms/userAccount';
import RuleCard from '@/components/posts/card/RuleCard';
import CommentArea from '@/components/comment/server-component/commentArea';
import DetailPostForm from '@/components/posts/detail/detailPostForm';
import { questPostRuleText } from '@/components/posts/card/const/rule_card_texts';
import dynamic from 'next/dynamic';
import MiniPostCard from '@/components/posts/card/MiniPostCard';
import { ImageUploadVariant } from '@/components/common/ImageUpload';
const PostSlider = dynamic(() => import('@/components/_global/slider/postSlider'), { ssr: false });

export type SbPageProps = {
    params: {
        postid: string;
        writer: userAccountState;
        rootCommentID?: number;
    };
    searchParams: {
        index: string;
    };
};

const SbPage: NextPage<SbPageProps> = async ({ params, searchParams }) => {
    const { writer, rootCommentID } = params;
    const borderColor = customColors.shadeLavender[300];

    logger.info('#PostPage Rendered', { message: params.postid });
    console.log(params.postid, searchParams.index);

    const post: PostType | null = await getPostWithID(params.postid, parseInt(searchParams.index));

    const allPosts: PostType[] | null = await getAllPosts();

    if (!post) {
        logger.error(`post${params.postid} not found`);
        throw new ReferenceError(`post not found`);
    }

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
                            <DetailPostForm writerAccount={writer} post={post}></DetailPostForm>

                            <Box h="16px" />

                            <Text fontSize="1.4em"> Submission</Text>
                            <PostSlider sliderName="sbsPostsOnDetail" hight="190px">
                                {allPosts?.map((post, index) => (
                                    <MiniPostCard key={index} index={index} post={post} />
                                ))}
                            </PostSlider>

                            <Spacer h="26px" />

                            <CommentArea postID={post.id}></CommentArea>
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
