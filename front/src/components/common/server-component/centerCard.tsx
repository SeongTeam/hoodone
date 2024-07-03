import { Box, Flex, SimpleGrid, Slider, Text } from '@chakra-ui/react';
import React, { Suspense } from 'react';
import { getCachedPaginatedPosts } from '@/lib/server-only/postLib';
import LoadMorePostCards from '@/components/posts/card/LoadMorePostCards';
import LoadMoreAdminPostCards from '@/components/posts/card/LoadMoreAdminCards';
import { customColors } from '@/utils/chakra/customColors';

/*TODO
- <PostList/> 컴포넌트에 Suspense 구현 
    - Post 로딩시, 사용자 경험을 제공하기 위함.
    - ref : https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming
- Infinite scroll 구현하기
    */
const CenterCard: React.FC = async () => {
    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const getPaginatedPostsFromAPI = async (offset: number) => {
        const res = await fetch(`http://localhost:4000/api/posts?offset=${offset}`);
        const posts = res.json();
        return posts;
    };

    return (
        <Flex
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
            pt="1rem"
            flexDir={'column'}
        >
            <SimpleGrid
                columns={{ sm: 1, md: 1 }}
                justifyContent="center"
                alignContent="center"
                spacing="4px"
            >
                <Box>
                    <Text mx="5px" mt="10px">
                        Admin Quest
                    </Text>
                </Box>
                <LoadMoreAdminPostCards />

                <LoadMorePostCards />
            </SimpleGrid>
        </Flex>
    );
};

export default CenterCard;
