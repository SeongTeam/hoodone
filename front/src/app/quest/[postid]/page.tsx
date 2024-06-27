import Post from '@/components/posts/view/server-component/post';
import { NextPage } from 'next';
import { PostType } from '@/atoms/post';
import { getPostWithID } from '@/lib/server-only/postLib';
import { Box, Text, Spacer, Flex, Grid, GridItem, VStack } from '@chakra-ui/react';
import logger from '@/utils/log/logger';
import CreationRulesBox from '@/components/posts/create/postFormat/subComponent/creationRulesBox';
import { customColors } from '@/utils/chakra/customColors';
import { useUserAccountWithSSR } from '@/hooks/userAccount';
import { userAccountState } from '@/atoms/userAccount';
import CommentArea from '@/components/comment/server-component/commentArea';
import DetailPostForm from '@/components/posts/detail/detailPostForm';
type QuestPageProps = {
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

    const QuestRuleBox: React.FC = () => {
        const outsideBg = customColors.white;
        const insideBg = customColors.pastelGreen[100];
        const BorderColor = customColors.shadeLavender[300];
        const rules: string[] = [
            '1. Enjoy Quest',
            '2. Leave your review',
            '3. Participate in the quest',
        ];

        return (
            <Box
                height="250px"
                // width={{ sm: '70%', base: '90%', lg: '100%' }}
                w="100%"
                py="20px"
                px="12px"
                bg={outsideBg}
                borderRadius="15px"
                border={`1px solid ${BorderColor}`}
            >
                <Text fontSize="1.4em"> Create Rule</Text>
                <VStack spacing="3px" p="12px" bg={insideBg} align="left">
                    <Text
                        mt="4px"
                        noOfLines={3}
                        fontSize="1.2em"
                        color="black"
                        whiteSpace="pre-line"
                    >
                        {rules[0]}
                    </Text>
                    <Text
                        mt="4px"
                        noOfLines={2}
                        fontSize="1.2em"
                        color="black"
                        whiteSpace="pre-line"
                    >
                        {rules[1]}
                    </Text>
                    <Text
                        mt="4px"
                        noOfLines={2}
                        fontSize="1.2em"
                        color="black"
                        whiteSpace="pre-line"
                    >
                        {rules[2]}
                    </Text>
                </VStack>
            </Box>
        );
    };

    logger.info('#PostPage Rendered', { message: params.postid });
    console.log(params.postid, searchParams.index);

    const post: PostType | null = await getPostWithID(params.postid, parseInt(searchParams.index));

    if (!post) {
        logger.error(`post${params.postid} not found`);
        throw new ReferenceError(`post not found`);
    }

    return (
        <Box width="100%" px="29px" pt="25px" pb="20px">
            <Text size="17px">User Quest</Text>
            <Spacer height="11px" />

            <Grid
                templateAreas={`"main main space createRule"
                "main  main space empty"
                "main main space empty"`}
                gridTemplateRows={'2em, 30px 1em'}
                gridTemplateColumns={'700px,2rem,'}
                w="100%"
                maxW="1300px"
                h="100%"
            >
                <GridItem pl="2" maxW={{ base: '800px', lg: '900px' }} area={'main'}>
                    {' '}
                    <Box bg="FFFFFF" borderRadius="15px" border={`1px solid ${inputBorderColor}`}>
                        <DetailPostForm
                            postInfo={post}
                            isQuestPost={true}
                            writerAccount={writer}
                        ></DetailPostForm>
                        <CommentArea postID={1} rootCommentID={rootCommentID} />
                    </Box>
                </GridItem>
                <GridItem pl="2" area={'space'}>
                    {' '}
                    <Box width="10px"> </Box>
                </GridItem>
                <GridItem width="100%" pl="2" area={'createRule'} alignContent="center" bg="purple">
                    <QuestRuleBox></QuestRuleBox>
                </GridItem>
            </Grid>
        </Box>
    );
};

export default QuestPage;
