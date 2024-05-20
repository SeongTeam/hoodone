import 'server-only';
import logger from '@/utils/log/logger';
import { PostApiResponseDto } from 'hoodone-shared';
import { PostType } from '@/atoms/post';
import assert from 'assert';
import { unstable_cache } from 'next/cache';
import Post from '@/components/posts/view/server-component/post';

const backendURL = process.env.BACKEND_URL;

/*
const configCld = {
    secure: true,
};

cloudinary.config({
    ...configCld,
});
*/

/*TODO
- @/lib/* 로 옮기기
  - server Action 내에서는 fetch 요청이 캐싱되지 않으므로 비효울적.
- Next Sever에서 posts[] 메모리에 저장 구현
  - client가 특정 post에 접근시도시, next server에 저장된 post[]에서 탐색후 반환
- Post 가져오는 로직 최적화 하기
  option1) Next Sever의 post[]에서 postID 탐색하여 가져오도록 수정 고려
  option2) Next Cache 활용
*/

export async function getAllPosts() {
    try {
        const res = await fetch(`${backendURL}/posts/all`, {
            next: { tags: ['Allposts'] },
        });
        if (!res.ok) {
            logger.error('getPosts error', { message: res });
            throw new Error('getPosts error');
        }
        const data: PostApiResponseDto = await res.json();

        return data.getAll as PostType[];
    } catch (error) {
        logger.error('getPosts error', { message: error });
        return null;
    }
}

export async function getPostWithIDFromCache(id: string, PostsPos: number) {
    try {
        const offset = Math.floor(PostsPos / defaultLimit) + 1;
        const [postsIniitalpage, postsLoadMorepage] = await Promise.all([
            getCachedPaginatedPosts(offset),
            getCachedPaginatedPosts(offset + 1),
        ]);

        if (!postsIniitalpage && !postsLoadMorepage) {
            throw new Error(`both pages are falsy. (id: ${id} , PostsPos: ${PostsPos})`);
        }

        const posts = [...(postsIniitalpage || []), ...(postsLoadMorepage || [])];

        assert(Array.isArray(posts));

        const post = posts.find((post) => {
            return post.id === parseInt(id);
        });

        if (!post) {
            throw new Error(`post with id ${id} not found in cache`);
        }

        return post;
    } catch (error) {
        logger.error('getPostWithIDFromCache error', { message: error });
        return null;
    }
}

export async function getPostWithIDFromServer(id: string) {
    try {
        const res = await fetch(`${backendURL}/posts/${id}`);

        if (!res.ok) {
            logger.error('getPostWithID error', { message: res });
            throw new Error('getPostWithID error');
        }

        const data: PostApiResponseDto = await res.json();
        console.log('getPostWithIDFromServer', data);

        return data.getById as PostType;
    } catch (error) {
        logger.error('getPostWithID error', { message: error });
        return null;
    }
}

export async function getPostWithID(id: string, PostsPos: number) {
    try {
        const cacheData = getPostWithIDFromCache(id, PostsPos);
        const backendData = getPostWithIDFromServer(id);

        const [cache, backend] = await Promise.all([cacheData, backendData]);

        const post = cache ?? backend;

        assert(post !== undefined, 'post shoulde be defined or null');
        return post;
    } catch (error) {
        logger.error('getPostWithID error', { message: error });
        return null;
    }
}

const defaultLimit = 5;
export async function getPaginatedPosts(
    offset: number,
    limit: number = defaultLimit,
): Promise<PostType[] | null> {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fetch(
                `${backendURL}/posts/paginated?offset=${offset}&limit=${limit}`,
            );

            if (!res.ok) {
                logger.error('getPaginatedPosts error', {
                    message: `(offset: ${offset}, limit: ${limit}) ${JSON.stringify(res.body)} ${
                        res.status
                    }`,
                });
                reject(new Error('getPaginatedPosts error'));
            }

            const dto: PostApiResponseDto = await res.json();
            const data = dto.getPaginatedPosts as PostType[];

            resolve(data);
        } catch (error) {
            logger.error('Error getPaginatedPosts', { message: error });
            resolve(null);
        }
    });
}

/*TODO
- unstable_cache() 안정성 확인 후, 사용 유지 고려하기
*/
export const getCachedPaginatedPosts = unstable_cache(
    async (offset: number) => getPaginatedPosts(offset),
    ['posts-paginated'],
    { tags: ['all-posts'] },
);
