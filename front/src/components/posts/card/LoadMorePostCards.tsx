"use client";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { useCallback, useEffect, useState } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import { PostType } from '@/type/postType';
import PostCard from "./PostCard";
import MotionDiv from "@/components/common/motionDiv";


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
const INITIAL_OFFSET = 1;
const BatchSize = 1;
const getPaginatedPostsFromAPI = async (offset: number) => {
    const res = await fetch(`http://localhost:4000/api/posts?offset=${offset}`)
    const posts = res.json();
    return posts;
}

const LoadMorePostCards : React.FC = ( ) => {
    const { ref, inView } = useInView()
    const [ posts, setPosts ] = useState<PostType[]>([])
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ hasMore, setHasMore ] = useState<boolean>(true);
    const [ offset, setOffset ] = useState<number>(INITIAL_OFFSET);

    const variants = {
        hidden : { opacity: 0 },
        visible: { opacity: 1 },
    }

    const loadPosts = useCallback( async () => {
        if(!hasMore|| isLoading) {
            return;
        }
        setIsLoading(true);
        try{
            const newPosts = await getPaginatedPostsFromAPI(offset);
            setPosts(posts => [...posts, ...newPosts]);
            setOffset(prev => prev + BatchSize);
            if(newPosts.length <= 0) setHasMore(false);
        }
        catch(error){
            console.log(error);
            setHasMore(false);
        }
        finally{
            setIsLoading(false);
        }
    },[isLoading,hasMore,offset]);
    

    useEffect( () => {

        return () => {
            setOffset(INITIAL_OFFSET);
            setHasMore(true);
        };
    },[]);

    // execute useEffect when ref( Element ) is in view
    useEffect( () => {
        if(inView){
            loadPosts();
        }
    },[inView,loadPosts])



    return (
        <>
            <Grid 
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
                                <PostCard post={post} key={post.id} index={index}/>
                            </MotionDiv>
                        </GridItem>
                        );
                })}
            </Grid>
            <section>
                <div ref={ref}>
                    {isLoading && <Image
                        src="/hood1/spinner.svg"
                        alt="spinner"
                        width={100}
                        height={100}
                        className="object-contain"
                    />}
                </div>
            </section>
        </>
    );
};

export default LoadMorePostCards;