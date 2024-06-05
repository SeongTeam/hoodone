"use client";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import PostList from "./postList";
import { PostType } from "@/atoms/post";

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



let offset = 2;
let isLoadingEnable= true;
const getPaginatedPostsFromAPI = async (offset: number) => {
    const res = await fetch(`http://localhost:4000/api/posts?offset=${offset}`)
    const posts = res.json();
    return posts;
}

const LoadMorePosts : React.FC = ( ) => {
    const { ref, inView } = useInView()
    const [ posts, setPosts ] = useState<PostType[]>([])
    
    // execute useEffect when ref( Element ) is in view
    useEffect(() => {
        if(inView && isLoadingEnable) {
            getPaginatedPostsFromAPI(offset++).then((res) => {
                setPosts( (prev) => ([...prev, ...res]));
                if(res.length <= 0 ) isLoadingEnable = false;
            })

            }
           
        }, [inView,posts])

    return (
        <>
        <PostList postList={posts}/>
            <section>
                <div ref={ref}>
                    <Image
                        src="/hood1/spinner.svg"
                        alt="spinner"
                        width={100}
                        height={100}
                        className="object-contain"
                    />
                </div>
            </section>
        </>
    );
};

export default LoadMorePosts;