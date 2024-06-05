"use client";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { useCallback, useEffect, useState } from "react";
import PostList from "./postList";
import { PostType } from "@/atoms/post";
import { off } from "process";

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



const INITIAL_OFFSET = 2;
const getPaginatedPostsFromAPI = async (offset: number) => {
    const res = await fetch(`http://localhost:4000/api/posts?offset=${offset}`)
    const posts = res.json();
    return posts;
}

const LoadMorePosts : React.FC = ( ) => {
    const { ref, inView } = useInView()
    const [ posts, setPosts ] = useState<PostType[]>([])
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ hasMore, setHasMore ] = useState<boolean>(true);
    const [ offset, setOffset ] = useState<number>(INITIAL_OFFSET);

    console.log("inView", inView);
    console.log("hasMore", hasMore);

    const loadPosts = useCallback( async () => {
        if(!hasMore|| isLoading) {
            console.log("no more posts",hasMore,isLoading);
            return;
        }
        setIsLoading(true);
        try{
            console.log("try state");
            const newPosts = await getPaginatedPostsFromAPI(offset);
            setPosts(posts => [...posts, ...newPosts]);
            setOffset(prev => prev++);
            if(newPosts.length <= 0) setHasMore(true);
        }
        catch(error){
            console.log(error);
            setHasMore(false);
        }
        finally{
            console.log("finally state");
            setIsLoading(false);
        }
    },[isLoading,hasMore,offset]);
    

    // execute useEffect when ref( Element ) is in view

    useEffect( () => {

        return () => {
            console.log("clean up");
            setOffset(INITIAL_OFFSET);
            setHasMore(true);
        };
    },[]);

    useEffect( () => {
        if(inView){
            console.log("inView");
            loadPosts();
        }
    },[inView,loadPosts])



    return (
        <>
            <PostList postList={posts}/>
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

export default LoadMorePosts;