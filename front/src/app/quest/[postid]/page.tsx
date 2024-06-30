import { NextPage } from 'next';
import { PostType } from '@/atoms/post';
import { getPostWithID } from '@/lib/server-only/postLib';
import { Box, Text, Spacer, Flex, Grid, GridItem, VStack, SimpleGrid } from '@chakra-ui/react';
import logger from '@/utils/log/logger';
import { customColors } from '@/utils/chakra/customColors';
import { useUserAccountWithSSR } from '@/hooks/userAccount';
import { userAccountState } from '@/atoms/userAccount';
import RuleCard from '@/components/posts/card/RuleCard';
import { PostSlider } from '@/components/_global/slider/postSliber';
import CommentArea from '@/components/comment/server-component/commentArea';
import DetailPostForm from '@/components/posts/detail/detailPostForm';
import { questPostRuleText } from '@/components/posts/card/const/rule_card_texts';

export type QuestPageProps = {
    params: {
        postid: string;
        writer: userAccountState;
        rootCommentID?: number;
    };
    searchParams: {
        index: string;
    };
};

const QuestPage: NextPage<QuestPageProps> = async ({ params, searchParams }) => {
    const { writer, rootCommentID } = params;
    const inputBorderColor = customColors.shadeLavender[300];

    logger.info('#PostPage Rendered', { message: params.postid });
    console.log(params.postid, searchParams.index);

    const post: PostType | null = await getPostWithID(params.postid, parseInt(searchParams.index));

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
                        <DetailPostForm writerAccount={writer} postInfo={post}></DetailPostForm>

                        <Spacer h="6px" />

                        <Text fontSize="1.4em"> Submission</Text>
                        <PostSlider></PostSlider>

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
    );
};

export default QuestPage;
