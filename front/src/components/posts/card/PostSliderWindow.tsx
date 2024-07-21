import { Box, Spacer, Text, VStack } from '@chakra-ui/react';
import PostCard from './PostCard';
import MotionDiv from '@/components/common/motionDiv';
import PostSlider from '@/components/_global/slider/postSlider';
import { POST_TYPE, } from '@/type/postType';
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

/*TODO
- posts===null 인 예외상황 처리 로직 추가
*/

type PostSliderWindowProp = {
    windowName : string
    type : POST_TYPE
}

const PostSliderWindow: React.FC<PostSliderWindowProp> = async ({ windowName , type }) => {

    const posts = await new PostFetchService(type).getCachedPaginatedPosts(INITIAL_OFFSET);

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    return (
        <Box w="100%">
            <Text mx="5px" mt="10px">
                {windowName}
            </Text>
            <PostSlider sliderName="User Quests" gap="20px">
                {posts && Array.isArray(posts) 
                && posts.map((post, index) => {
                    return (
                        <MotionDiv
                            key={`easeInOut-${post.postData.id}`}
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
                            <PostCard post={post} key={post.postData.id} index={index} type={type} />
                        </MotionDiv>
                    );
                })}
            </PostSlider>
        </Box>
    );
};

export default PostSliderWindow;
