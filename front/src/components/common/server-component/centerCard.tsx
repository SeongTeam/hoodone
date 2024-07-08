import { Box, Flex, SimpleGrid, Slider, Text } from '@chakra-ui/react';
import React, { Suspense } from 'react';
import { customColors } from '@/utils/chakra/customColors';
import { POST_TYPE } from '@/type/postType';
import AdminPostSliderWidnow from '@/components/posts/card/AdminPostSliderWidnow';
import PostSliderWindow from '@/components/posts/card/PostSliderWindow';

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

                <AdminPostSliderWidnow />

                <PostSliderWindow
                    windowName = "User Quest"
                    type = {POST_TYPE.QUEST}
                 />

                <PostSliderWindow
                    windowName = "User Submissions"
                    type = {POST_TYPE.SB}
                 />
            </SimpleGrid>
        </Flex>
    );
};

export default CenterCard;
