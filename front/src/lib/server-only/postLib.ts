import 'server-only';
import logger from '@/utils/log/logger';
import { PostApiResponseDto } from 'hoodone-shared';
import assert from 'assert';
import { unstable_cache } from 'next/cache';
import { PostType } from '@/type/postType';

const backendURL = process.env.BACKEND_URL;

/*
const configCld = {
    secure: true,
};

cloudinary.config({
    ...configCld,
});
*/

export const getPostLibConfig = () => {
    const defaultLimit = 5;
    const initialOffset = 0;

    return { defaultLimit, initialOffset };
};

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
    const { defaultLimit } = getPostLibConfig();

    try {
        const offset = Math.floor(PostsPos / defaultLimit) + 1;
        const posts = await getCachedPaginatedPosts(offset, defaultLimit);

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
        logger.info('getPostWithIDFromServer is called');

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

        const post = await Promise.race([cacheData, backendData]);

        assert(post !== undefined, 'post shoulde be defined or null');
        return post;
    } catch (error) {
        logger.error('getPostWithID error', { message: error });
        return null;
    }
}

export async function getPaginatedPosts(offset: number, limit: number) {
    try {
        const res = await fetch(`${backendURL}/quests/paginated?offset=${offset}&limit=${limit}`);

        if (!res.ok) {
            logger.error('getPaginatedPosts error', {
                message: `(offset: ${offset}, limit: ${limit}) ${JSON.stringify(res.body)} ${
                    res.status
                }`,
            });
            throw new Error('getPaginatedPosts error');
        }

        const dto: PostApiResponseDto = await res.json();
        const data = dto.getPaginatedPosts as PostType[];

        return data;
    } catch (error) {
        logger.error('Error getPaginatedPosts', { message: error });
        return null;
    }
}

/*TODO
- unstable_cache() 안정성 확인 후, 사용 유지 고려하기
*/
export const getCachedPaginatedPosts = unstable_cache(
    async (offset: number, limit: number) => getPaginatedPosts(offset, limit),
    ['posts-paginated'],
    { tags: ['all-posts'] },
);
