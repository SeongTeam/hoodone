import Link from 'next/link';
import { Box, Flex, Spacer, SimpleGrid } from '@chakra-ui/react';
import { POST_TYPE } from '@/components/posts/postType';
import AdminPostSliderWidnow from '@/components/posts/card/AdminPostSliderWidnow';
import PostSliderWindow from '@/components/posts/card/PostSliderWindow';

/* TODO
- style 적용 불가 원인 분석 및 해결
- Home page 디자인
  - NaviBar 디자인
  - Auth 로직 구현  
*/
export default function Home() {
    return (
            <main>
                <SimpleGrid
                w={"100%"}
                columns={1}
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
            </main>
    );
}
