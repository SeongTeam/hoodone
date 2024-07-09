'use client';
import Image from 'next/image';
import { useInView } from 'react-intersection-observer';
import { useCallback, useEffect, useState } from 'react';
import { Grid, GridItem, } from '@chakra-ui/react';
import PostCard from './PostCard';
import MotionDiv from '@/components/common/motionDiv';
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
    console.log('getPaginatedPostsFromAPI', {offset, type});
    const res = await fetch(`${apiUrl}/posts?offset=${offset}&type=${type}`);
    const posts = res.json();
    return posts;
};

type PostWinowProps = {
    type: POST_TYPE
}

const PostWinow: React.FC<PostWinowProps> = ({ type }) => {
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
    }, [isLoading, hasMore, offset,type]);

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
            <Grid
                id = 'PostCard grid'
                templateColumns="repeat(auto-fill,minmax(250px,1fr))"
                gap ="20px"
                width="100%"
                >
                {
                    posts.map((post, index) => {
                        return (
                        <GridItem key = {post.id} maxW="340px">
                            <MotionDiv
                                variants={variants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                transition={{ 
                                    delay: index * 0.1,
                                    ease: "easeInOut",
                                    duration: 0.5 
                                }}
                                viewport={{amount: 0}}
                            >
                                <PostCard 
                                    type={type}
                                    post={post} 
                                    key={post.id} 
                                    index={index}/>
                            </MotionDiv>
                        </GridItem>
                        );
                })}
            </Grid>
            <section
                id = 'LoadMorepost'
            >
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

export default PostWinow;
