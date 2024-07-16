import { Box, Grid, GridItem, HStack, Spacer, Stack, VStack, Text } from '@chakra-ui/react';
import CreatePostForm from '@/components/posts/create/createPostForm';
import { customColors } from '@/utils/chakra/customColors';
import CreationRulesBox from '@/components/posts/create/postFormat/subComponent/creationRulesBox';
import { POST_TYPE } from '@/components/posts/postType';

export default function CreateQuestPage() {

    return (
        <Box width="100%" px="29px" pt="25px" pb="20px">
            <Text size="17px">User Quest</Text>
            <Spacer height="11px" />
            <Grid
                templateAreas={`"main main space createRule"
              "main  main space empty"
              "main main space empty"`}
                gridTemplateRows={'2em, 30px 1em'}
                gridTemplateColumns={'700px,2em,'}
                w="100%"
                maxW="1300px"
                h="100%"
            >
                <GridItem pl="2" area={'main'}>
                    {' '}
                    <CreatePostForm type={POST_TYPE.QUEST} />
                </GridItem>
                <GridItem pl="2" area={'space'}>
                    {' '}
                    <Box width="10px"> </Box>
                </GridItem>
                <GridItem width="100%" pl="2" area={'createRule'} alignContent="center">
                    <CreationRulesBox isQuestPost={true}></CreationRulesBox>
                </GridItem>
            </Grid>
        </Box>
    );
}
