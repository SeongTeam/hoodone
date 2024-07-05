'use client';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { useCallback, useEffect, useState } from 'react';
import { Box, Spacer, Text, VStack } from '@chakra-ui/react';
import PostCard from './PostCard';
import MotionDiv from '@/components/common/motionDiv';
import PostSlider from '@/components/_global/slider/postSlider';
import { POST_TYPE, PostType } from '@/type/postType';

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

const getPaginatedPostsFromAPI = async (offset: number, type : POST_TYPE) => {
    const res = await fetch(`${apiUrl}/posts?offset=${offset}&type=${type}`);
    const posts = res.json();
    return posts;
};

type LoadMorePostCardsProps = {
    type: POST_TYPE
}

const LoadMorePostCards: React.FC<LoadMorePostCardsProps> = ({ type }) => {
    const { ref, inView } = useInView();
    const [posts, setPosts] = useState<PostType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [offset, setOffset] = useState<number>(INITIAL_OFFSET);

    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const loadPosts = useCallback(async () => {
        if (!hasMore || isLoading) {
            return;
        }
        setIsLoading(true);
        try {
            const newPosts = await getPaginatedPostsFromAPI(offset,type);
            setPosts((posts) => [...posts, ...newPosts]);
            setOffset((prev) => prev + BatchSize);
            if (newPosts.length <= 0) setHasMore(false);
        } catch (error) {
            console.log(error);
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, hasMore, offset]);

    useEffect(() => {
        return () => {
            setOffset(INITIAL_OFFSET);
            setHasMore(true);
        };
    }, []);

    // execute useEffect when ref( Element ) is in view
    useEffect(() => {
        if (inView) {
            loadPosts();
        }
    }, [inView, loadPosts]);

    return (
        <div>
            <Text mx="5px" mt="10px">
                User Quest
            </Text>
            <PostSlider sliderName="User Quests" gap="20px" hight="440px">
                {posts.map((post, index) => {
                    return (
                        <MotionDiv
                            key={post.id}
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
                            <PostCard post={post} key={post.id} index={index} type="quest" />
                        </MotionDiv>
                    );
                })}
            </PostSlider>
            <Box>
                <Text mx="5px" mt="5px">
                    Submissions
                </Text>
            </Box>
            <section>
                <span ref={ref}>
                    {isLoading && (
                        <Image
                            src="/hood1/spinner.svg"
                            alt="spinner"
                            width={100}
                            height={100}
                            className="object-contain"
                        />
                    )}
                </span>
            </section>
        </div>
    );
};

export default LoadMorePostCards;
