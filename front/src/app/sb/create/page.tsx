'use client';

import { Box, Grid, GridItem, HStack, Spacer, Stack, VStack, Text } from '@chakra-ui/react';
import CreatePostForm from '@/components/posts/create/createPostForm';
import { useUserAccountWithSSR } from '@/hooks/userAccount';
import { customColors } from '@/utils/chakra/customColors';
import CreationRulesBox from '@/components/posts/create/postFormat/subComponent/creationRulesBox';
import { POST_TYPE } from '@/type/postType';

export default function CreateSbPage() {
    const [user, setUser] = useUserAccountWithSSR();

    return (
        <Box width="100%" px="29px" pt="25px" pb="20px">
            <Text size="17px">User Quest</Text>
            <Spacer height="11px" />
            <Grid
                templateAreas={`"main main space createRule"
              "main  main space empty"
              "main main space empty"`}
                gridTemplateRows={'3.5rem, 30px 1rem'}
                gridTemplateColumns={'200px,2rem,'}
                w="100%"
                h="100%"
            >
                <GridItem pl="2" width="100%" area={'main'}>
                    {' '}
                    <CreatePostForm type={POST_TYPE.SB} />
                </GridItem>
                <GridItem pl="2" area={'space'}>
                    {' '}
                    <Box width="10px"> </Box>
                </GridItem>
                <GridItem pl="2" area={'createRule'} alignContent="center">
                    <CreationRulesBox isQuestPost={false}></CreationRulesBox>
                </GridItem>
            </Grid>
        </Box>
    );
}
