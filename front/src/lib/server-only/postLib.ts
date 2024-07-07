import 'server-only';
import logger from '@/utils/log/logger';
import { PostApiResponseDto } from 'hoodone-shared';
import assert from 'assert';
import { unstable_cache } from 'next/cache';
import { PostType, POST_TYPE } from '@/type/postType';

type PostRoute = 'sbs' | 'quests';

enum CACHE_KEY_PART {
    QUSET_KEY = 'Quest-Paginated',
    SUBMISSION_KEY = 'Submission-Paginated',
}
export class PostFetchService {
    type: POST_TYPE;

    private routeSegment: PostRoute;
    private cacheTag: POST_TYPE;
    private cacheKeyPart;
    private defaultLimit = 5;
    private initialOffset = 1;
    private backendURL = process.env.BACKEND_URL;

    constructor(type: POST_TYPE) {
        this.type = type;

        switch (type) {
            case POST_TYPE.QUEST:
                this.routeSegment = 'quests';
                this.cacheTag = POST_TYPE.QUEST;
                this.cacheKeyPart = CACHE_KEY_PART.QUSET_KEY;
                break;
            case POST_TYPE.SB:
                this.routeSegment = 'sbs';
                this.cacheTag = POST_TYPE.SB;
                this.cacheKeyPart = CACHE_KEY_PART.SUBMISSION_KEY;
                break;
            default:
                logger.error('Construct PostInfo error. Invalid post type', {
                    message: { type },
                });
                throw new Error('Invalid post type');
                break;
        }
    }

    async getCachedPaginatedPosts(offset: number, limit: number = this.defaultLimit) {
        const cachdFunc = unstable_cache(
            async (offset, limit) => this.getPaginatedPosts(offset, limit),
            [this.cacheKeyPart],
            {
                tags: [this.cacheTag],
            },
        );

        return await cachdFunc(offset, limit);
    }

    async getPostByID(id: string, PostsPos: number) {
        try {
            const cachePromise = this.getPostWithIDFromCache(id, PostsPos);
            const backendPromise = this.getPostWithIDFromServer(id);
            const timeOutPromise = new Promise<null>((_, reject) => {
                const timeOutMs = 5000;
                setTimeout(() => {
                    reject(new Error('getPostWithID time out'));
                }, timeOutMs);
            }).catch((error) => {
                logger.error('getPostWithID time out error', { message: error });
                return null;
            });

            const post = await Promise.race([cachePromise, backendPromise, timeOutPromise]);

            assert(post !== undefined, 'post shoulde be defined or null');

            if (post === null) {
                logger.error('getPostWithID error', { message: { id, PostsPos } });
                throw new Error(`post with id ${id} not found in cache and server`);
            }
            return post;
        } catch (error) {
            logger.error('getPostWithID error', { message: error });
            return null;
        }
    }

    private async getPaginatedPosts(offset: number, limit: number) {
        try {
            if (offset <= 0) {
                logger.error('offset <= 0', { message: { offset } });
                throw new Error('offset is invalid');
            }
            if (limit <= 0) {
                logger.error('limit <= 0', { message: { limit } });
                throw new Error('limit is invalid');
            }

            const res = await fetch(
                `${this.backendURL}/${this.routeSegment}/paginated?offset=${offset}&limit=${limit}`,
            );

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

    private async getPostWithIDFromCache(id: string, PostsPos: number) {
        try {
            const offset = Math.floor(PostsPos / this.defaultLimit) + 1;
            const posts = await this.getCachedPaginatedPosts(offset, this.defaultLimit);

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

    private async getPostWithIDFromServer(id: string) {
        try {
            const res = await fetch(`${this.backendURL}/posts/${id}`);

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
}
