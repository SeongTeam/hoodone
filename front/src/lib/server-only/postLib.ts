import 'server-only';
import logger from '@/utils/log/logger';
import { PostApiResponseDto } from 'hoodone-shared';
import assert from 'assert';
import { unstable_cache } from 'next/cache';
import {
    POST_TYPE_MAP,
    POST_TYPE,
    PostContainer,
    QuestPost,
    SubmissionPost,
} from '@/type/postType';
import { setTimeout as setTimeoutPromise } from 'timers/promises';
import { LoggableResponse } from '@/utils/log/types';

type PostRoute = 'sbs' | 'quests';

export namespace PostCache {
    enum POST_CACHE_TAG {
        QUEST = 'Quest',
        SB = 'Submission',
        PAGINATED = 'Paginated',
        OFFSET = 'Offset',
        ID = 'ByID',
    }

    export function getPostTag(postType: POST_TYPE) {
        switch (postType) {
            case POST_TYPE.QUEST:
                return POST_CACHE_TAG.QUEST;
            case POST_TYPE.SB:
                return POST_CACHE_TAG.SB;
            default:
                logger.error('Construct PostInfo error. Invalid post type', {
                    message: { postType },
                });
                throw new Error('Invalid post type');
                break;
        }
    }

    export function getPaginatedTag(postType: POST_TYPE, pageoffset: number) {
        const postTypeTag = getPostTag(postType);
        return `${postTypeTag}-${POST_CACHE_TAG.PAGINATED}-${POST_CACHE_TAG.OFFSET}:${pageoffset}`;
    }

    export function getSinglePostTag(postType: POST_TYPE, postID: number) {
        const postTypeTag = getPostTag(postType);
        return `${postTypeTag}-${POST_CACHE_TAG.ID}:${postID}`;
    }
}

export class PostFetchService<T extends POST_TYPE> {
    type: POST_TYPE;

    static CACHE_KEY_PART = {
        QUSET_KEY: 'Quest-Paginated',
        SUBMISSION_KEY: 'Submission-Paginated',
    } as const;

    private routeSegment: PostRoute;
    private cacheKeyPart;
    private defaultLimit = 5;
    private initialOffset = 1;
    private backendURL = process.env.BACKEND_URL;

    constructor(type: POST_TYPE) {
        this.type = type;

        switch (type) {
            case POST_TYPE.QUEST:
                this.routeSegment = 'quests';
                this.cacheKeyPart = PostFetchService.CACHE_KEY_PART.QUSET_KEY;
                break;
            case POST_TYPE.SB:
                this.routeSegment = 'sbs';
                this.cacheKeyPart = PostFetchService.CACHE_KEY_PART.SUBMISSION_KEY;
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
        const revalidateSecond = 60 * 3;

        const postTag = PostCache.getPostTag(this.type);
        const pageTag = PostCache.getPaginatedTag(this.type, offset);

        const cachdFunc = unstable_cache(
            async (offset, limit) => this.getPaginatedPosts(offset, limit),
            [this.cacheKeyPart],
            {
                tags: [postTag, pageTag],
                revalidate: revalidateSecond,
            },
        );

        return await cachdFunc(offset, limit);
    }

    async getPostByID(id: string, PostsPos: number) {
        const abortController = new AbortController();
        const { signal } = abortController;
        const timeoutMs = 5000;
        try {
            const backendPromise = this.getPostByIDFromServer(id);
            const cachePromise = this.getPostByIDFromCache(id, PostsPos).then(async (post) => {
                if (post === null) {
                    await backendPromise;
                }
                return post;
            });

            const timeOutPromise = setTimeoutPromise(timeoutMs, null, { signal })
                .then(() => {
                    throw new Error(`[getPostByID]] postId ${id} not found in cache and server`);
                })
                .catch((error) => {
                    if (error.name === 'AbortError') {
                        return null;
                    }
                    logger.error(`[getPostByID] time out. postId: ${id}, PostsPos: ${PostsPos}`, {
                        message: error,
                    });
                    return null;
                });

            const post = await Promise.race([cachePromise, backendPromise, timeOutPromise]);

            abortController.abort();

            assert(post !== undefined, 'post shoulde be defined or null');

            if (post === null) {
                logger.error('getPostByID error', { message: { id, PostsPos } });
                throw new Error(`[getPostByID]] postId ${id} not found in cache and server`);
            }

            return post;
        } catch (error) {
            logger.error('getPostByID error', { message: error });
            return null;
        }
    }

    private async getPaginatedPosts(offset: number, limit: number) {
        const postTag = PostCache.getPostTag(this.type);
        const pageTag = PostCache.getPaginatedTag(this.type, offset);
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
                { next: { tags: [postTag, pageTag] } },
            );

            if (!res.ok) {
                const resLog = new LoggableResponse(res);
                logger.error('getPaginatedPosts error', {
                    message: `(offset: ${offset}, limit: ${limit})`,
                    response: resLog,
                });
                throw new Error('getPaginatedPosts error');
            }

            const dto: PostApiResponseDto = await res.json();
            const datalist = dto.getPaginatedPosts as POST_TYPE_MAP[T][];

            assert(Array.isArray(datalist));

            if (datalist.length === 0) {
                return null;
            }

            const posts: PostContainer<POST_TYPE_MAP[T]>[] = datalist.map((data) => {
                const post: PostContainer<POST_TYPE_MAP[T]> = {
                    postData: data,
                    paginatedOffset: offset,
                    lastFetched: new Date(),
                };
                return post;
            });

            return posts;
        } catch (error) {
            logger.error('Error getPaginatedPosts', { message: error });
            return null;
        }
    }

    private async getPostByIDFromCache(id: string, PostsPos: number) {
        try {
            const offset = Math.floor(PostsPos / this.defaultLimit) + 1;
            const posts = await this.getCachedPaginatedPosts(offset, this.defaultLimit);

            assert(Array.isArray(posts));

            let post: PostContainer<POST_TYPE_MAP[T]> | null | undefined = posts.find((post) => {
                return post.postData.id === parseInt(id);
            });

            if (!post) {
                logger.error(
                    `[getPostByIDFromCache] post id : ${id} , PostsPos: ${PostsPos} not found in cache`,
                );
                post = null;
            }

            return post;
        } catch (error) {
            logger.error('getPostByIDFromCache error', { message: error });
            return null;
        }
    }

    private async getPostByIDFromServer(id: string) {
        const NO_OFFSET = 0;
        try {
            const res = await fetch(`${this.backendURL}/${this.routeSegment}/${id}`, {
                method: 'GET',
                cache: 'no-store',
            });

            if (!res.ok) {
                const resLog = new LoggableResponse(res);
                logger.error('getPostByIDFromServer error', { response: resLog });
                throw new Error('getPostByIDFromServer error');
            }

            const dto: PostApiResponseDto = await res.json();
            logger.info(`path ${this.backendURL}/${this.routeSegment}/${id}`);

            logger.info('getPostByIDFromServer is called');

            const data = dto.getById as POST_TYPE_MAP[T];

            const post: PostContainer<POST_TYPE_MAP[T]> = {
                postData: data,
                paginatedOffset: NO_OFFSET,
                lastFetched: new Date(),
            };
            return post;
        } catch (error) {
            logger.error('getPostByIDFromServer error', { message: error });
            logger.error(`path ${this.backendURL}/${this.routeSegment}/${id}`);
            return null;
        }
    }
}
