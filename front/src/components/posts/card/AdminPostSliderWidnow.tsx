import React from 'react';
import { Box, Grid, GridItem, Text } from '@chakra-ui/react';
import PostCard from './PostCard';
import MotionDiv from '@/components/common/motionDiv';
import AdminPostCard from './AdminPostCard';
import PostSlider from '@/components/_global/slider/postSlider';
import Link from 'next/link';
import { customColors } from '@/utils/chakra/customColors';
import { POST_TYPE, PostType } from '@/type/postType';
import { PostFetchService } from '@/lib/server-only/postLib';

/*TODO
- route handler GET METHOD cache 활용 여부 확인
- motion.div 공부하기
    https://velog.io/@keumky1/Framer-Motion-%EC%9E%85%EB%AC%B8%ED%95%98%EA%B8%B0
*/

/*reference
- https://www.youtube.com/watch?v=FKZAXFjxlJI
    - implement inifinte scroll to show PostListItem
    - Using motion.div on Server component. 
*/

const apiUrl = process.env.NEXT_PUBLIC_FRONT_API_URL;
const INITIAL_OFFSET = 1;
const BatchSize = 1;

/* TODO 
- admin의 Quest를 fetch하는 로직 추가
- posts===null 인 예외상황 처리 로직 추가
*/

interface AdminPostSliderWidnowProps {
}

const AdminPostSliderWidnow: React.FC<AdminPostSliderWidnowProps> = async () => {
    const posts = await new PostFetchService(POST_TYPE.QUEST).getCachedPaginatedPosts(INITIAL_OFFSET);


    const postColor = [
        customColors.pastelGreen[300],
        customColors.aqua[100],
        customColors.pastelYellow[100],
    ];

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };



    return (
        <Box>
            <Text>
                Admin Quest
            </Text> 
            <Box h={110 + 20 + 'px'} bg="white" alignContent="center">

                <PostSlider sliderName="AdminQuests" gap="10px">
                    {posts.map((post, index) => {
                            return (
                                <MotionDiv
                                    variants={variants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    transition={{
                                        delay: index * 0.1,
                                        ease: 'easeInOut',
                                        duration: 0.5,
                                    }}
                                    viewport={{ amount: 0 }}
                                >
                                    <AdminPostCard
                                        pushedPath={`/quest/${post.id}?index=${index}`}
                                        post={post}
                                        key={post.id}
                                        index={index}
                                        bg={postColor[index % postColor.length]}
                                    />
                                </MotionDiv>
                            );
                    })}
                </PostSlider>
            </Box>
        </Box>
    );
};

export default AdminPostSliderWidnow;
