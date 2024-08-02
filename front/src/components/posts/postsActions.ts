'use server';
import logger from '@/utils/log/logger';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
    NEW_POST_FORMAT,
    POST_TYPE,
    NewPostForm,
    QuestPost,
    SubmissionPost,
} from '@/components/posts/postType';
import { revalidateTag } from 'next/cache';
import { assert, log } from 'console';
import { validateAuth } from '@/lib/server-only/authLib';
import { getUserBasicInfo } from '@/lib/server-only/authLib';
import { validateImage, uploadQuestImage, uploadSubmissionImage } from '@/utils/cloudinary/lib';
import { cloudinaryTempData } from '@/utils/cloudinary/mockUpData';
import { responseData } from '@/type/responseType';
import {
    PostApiResponseDto,
    voteResponseDto,
} from '@/sharedModule/response-dto/post-api-reponse.dto';
import { PostCache } from '@/components/posts/postLib';
import { LoggableResponse } from '@/utils/log/types';
import { QuestPostApiResponseDto, SbPostApiResponseDto } from '@/sharedModule/index';
import { userAccountState } from '@/atoms/userAccount';
import { setFavoriteDTO } from '@/components/posts/postAction.dto';

/*
ref : https://www.youtube.com/watch?v=5L5YoFm1obk

*/

/*TODO
- upload_stream() 과 buffer 활용 이해하기.
- 응답에 Public ID 담아서 보내기
- 삭제 로직 구현하기
*/

const backendURL = process.env.BACKEND_URL;

export async function createPosts(formData: FormData, editPostId?: number) {
    /*TODO 
    - upload 실패 예외처리 로직 구현
      - 발생한 에러 명확한 정보 logger로 출력
      - 예외 상황에 따른 시나리오 고려 및 구현

  */
    const postDtoString = formData.get(NEW_POST_FORMAT.POST_DTO);
    const imageFile = formData.get(NEW_POST_FORMAT.IMAGE) as File;
    let res: Response | null = null;

    try {
        if (typeof postDtoString !== 'string') {
            logger.error('[createPosts] postDtoString is not string', { postDtoString });
            throw new Error('[createPosts] postDtoString error');
        }

        logger.info('[createPosts] postDtoString: ', { postDtoString });

        const postDto: NewPostForm = JSON.parse(postDtoString);

        const accessToken = await validateAuth();
        const type = postDto.type;

        const userInfoPromise = getUserBasicInfo();
        const uploadPromise = uploadImage(imageFile, type, postDto);

        const [userInfo, upload] = await Promise.all([userInfoPromise, uploadPromise]);

        if (editPostId) {
            switch (type) {
                case POST_TYPE.QUEST:
                    res = await editQuest(accessToken, editPostId, postDto);
                    break;
                case POST_TYPE.SB:
                    res = await editSubmission(accessToken, editPostId, postDto);
                    break;
                default:
                    logger.error('[createPosts] edit fail. POST_TYPE is invalid. type = ', type);
                    throw new Error('[createPosts] POST_TYPE error');
                    break;
            }
        } else {
            switch (type) {
                case POST_TYPE.QUEST:
                    res = await formQuest(accessToken, postDto);
                    break;
                case POST_TYPE.SB:
                    res = await formSubmissions(accessToken, postDto);
                    break;
                default:
                    logger.error('[createPosts] create fail. POST_TYPE is invalid. type = ', type);
                    throw new Error('[createPosts] POST_TYPE error');
                    break;
            }
        }

        if (!res.ok) {
            logger.error('[createPosts] response is not ok. status', {
                message: res.status,
            });
            logger.info('res: ', { message: res });
            logger.info('newPost: ', { message: postDto });
            throw new Error('createPosts error');
        }

        let postTag = '';
        if (type === POST_TYPE.SB) {
            postTag = PostCache.getPostTag(POST_TYPE.SB);
        } else {
            if (userInfo.isAdmin) postTag = PostCache.getAdminQuestTag(POST_TYPE.QUEST);
            else postTag = PostCache.getPostTag(POST_TYPE.QUEST);
        }
        revalidateTag(postTag);
    } catch (error) {
        logger.error('createPosts error', { message: error });
        return null;
    }

    redirect('/');
}

async function formQuest(accessToken: string, newPost: NewPostForm) {
    let res: Response | null = null;
    try {
        res = await fetch(`${backendURL}/quests`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(newPost),
        });
        return res;
    } catch (error) {
        logger.error('formQuest error', { message: error });
        throw new Error('formQuest error');
    }
}

async function formSubmissions(accessToken: string, newPost: NewPostForm) {
    let res: Response;
    const questId = newPost.parentQuestId;

    if (questId === undefined || questId === null) {
        logger.error('[formSubmissions] questId invalidation error', {
            message: JSON.stringify(newPost),
        });
        throw new Error('questId is invalid.');
    }

    try {
        res = await fetch(`${backendURL}/sbs`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${accessToken}`,
                questId: questId,
            },
            body: JSON.stringify(newPost),
        });

        const cacheTag = PostCache.getRelatedPostlistTag(POST_TYPE.QUEST, parseInt(questId));
        revalidateTag(cacheTag);
        return res;
    } catch (error) {
        logger.error('formSubmissions error', { message: error });
        throw new Error('formSubmissions error');
    }
}

async function editQuest(accessToken: string, questId: number, newPost: NewPostForm) {
    let res: Response | null = null;
    try {
        res = await fetch(`${backendURL}/quests/${questId}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(newPost),
        });
        return res;
    } catch (error) {
        logger.error('editQuest error', { message: error });
        throw new Error('editQuest error');
    }
}

async function editSubmission(accessToken: string, sbId: number, newPost: NewPostForm) {
    let res: Response | null = null;

    try {
        res = await fetch(`${backendURL}/sbs/${sbId}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(newPost),
        });
        return res;
    } catch (error) {
        logger.error('editSubmission error', { message: error });
        throw new Error('editSubmission error');
    }
}

async function uploadImage(imageFile: File, type: POST_TYPE, newPost: NewPostForm) {
    if (validateImage(imageFile)) {
        let publicId: string | null = null;
        const userInfo = await getUserBasicInfo();
        if (!userInfo) {
            logger.error('[createPosts] getUserBasicInfo fail ', { userInfo });
            throw new Error('[createPosts] getUserBasicInfo error');
        }

        switch (type) {
            case POST_TYPE.QUEST:
                publicId = await uploadQuestImage(imageFile, userInfo.email);
                break;
            case POST_TYPE.SB:
                publicId = await uploadSubmissionImage(imageFile, userInfo.email);
                break;
            default:
                throw new Error('[createPosts] POST_TYPE error');
                break;
        }

        if (publicId) newPost.cloudinaryPublicId = publicId;
        else throw new Error('[createPosts] uploadQuestImage error');
    } else if (!imageFile) {
        if (type === POST_TYPE.QUEST)
            newPost.cloudinaryPublicId = cloudinaryTempData.defaultQuestPublicId;
        else newPost.cloudinaryPublicId = cloudinaryTempData.defaultSBPublicId;
    }
}

export async function setFavoriteQuest(questId: number, offset: number, isAdd: boolean) {
    const ret: responseData = {
        ok: false,
        message: '',
        response: { favoriteQuests: [], favoriteSbs: [] } as setFavoriteDTO,
    };
    const pageTag = PostCache.getPaginatedTag(POST_TYPE.QUEST, offset);

    try {
        let favoriteQuests = [];
        const accessToken = await validateAuth();
        if (isAdd) {
            favoriteQuests = await addFavoriteQuest(accessToken, questId);
        } else {
            favoriteQuests = await deleteFavoriteQuest(accessToken, questId);
        }
        ret.ok = true;
        ret.response = { favoriteQuests, favoriteSbs: [] };
        revalidateTag(pageTag);
    } catch (error) {
        logger.error('[setFavoriteQuest] error', { message: error });
        ret.message = 'Favorite Quest Operation. try it later';
    } finally {
        return ret;
    }
}

export async function setFavoriteSb(sbId: number, offset: number, isAdd: boolean) {
    const ret: responseData = {
        ok: false,
        message: '',
        response: { favoriteQuests: [], favoriteSbs: [] } as setFavoriteDTO,
    };
    const pageTag = PostCache.getPaginatedTag(POST_TYPE.SB, offset);
    try {
        let favoriteSbs = [];
        const accessToken = await validateAuth();
        if (isAdd) {
            favoriteSbs = await addFavoriteSb(accessToken, sbId);
        } else {
            favoriteSbs = await deleteFavoriteSb(accessToken, sbId);
        }
        ret.ok = true;
        ret.response = { favoriteSbs };
        revalidateTag(pageTag);
    } catch (error) {
        logger.error('[setFavoriteSb] error', { message: error });
        ret.message = 'Favorite Submission Operation. try it later';
    } finally {
        return ret;
    }
}

export async function evaluateSubmission(
    type: POST_TYPE,
    sbId: number,
    postPos: number,
    isPositive: boolean,
) {
    const ret: responseData = {
        ok: false,
        message: '',
        response: {},
    };
    const pageTag = PostCache.getPaginatedTag(type, postPos);

    try {
        if (type !== POST_TYPE.SB) {
            logger.info('[estimateSubmission] type is not SB', {
                message: { type, sbId, isPositive },
            });
            throw new Error('[estimateSubmission] type invalid error');
        }
        const accessToken = await validateAuth();
        const res = await fetch(`${backendURL}/sbs/${sbId}/${isPositive ? 'true' : 'false'}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${accessToken}`,
            },
        });

        if (!res.ok) {
            const logableRes = new LoggableResponse(res);
            logger.error('[estimateSubmission] res is not ok', {
                response: logableRes,
                message: { type, sbId, isPositive },
            });
            throw new Error('[estimateSubmission] res invalid error');
        }

        const data: PostApiResponseDto = await res.json();
        logger.info('[estimateSubmission] data', { response: JSON.stringify(data) });
        if (!data.patchVote) {
            logger.error('[estimateSubmission] data.patchVote is null', {
                response: JSON.stringify(data),
                message: JSON.stringify({ type, sbId, isPositive }),
            });
            throw new Error('[estimateSubmission] data.patchVote is null');
        }

        ret.ok = data.patchVote.ok;
        ret.message = data.patchVote.message;
        ret.response = data.patchVote.result;

        revalidateTag(pageTag);

        return ret;
    } catch (error) {
        logger.info('estimateSubmission error', { message: error });
        throw new Error('estimateSubmission error');
    }
}

export async function deletePost(type: POST_TYPE, postId: number, postPos: number) {
    let path = backendURL;

    switch (type) {
        case POST_TYPE.QUEST:
            path = `${backendURL}/quests/${postId}`;
            break;
        case POST_TYPE.SB:
            path = `${backendURL}/sbs/${postId}`;
            break;
    }

    try {
        const accessToken = await validateAuth();
        const res = await fetch(path, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${accessToken}`,
            },
        });

        if (!res.ok) {
            const logableRes = new LoggableResponse(res);
            logger.error('[deletePost] res is not ok', {
                response: logableRes,
                message: { type, postId },
            });
            throw new Error('[deletePost] res invalid error');
        }

        const data: PostApiResponseDto = await res.json();
        logger.info('[deletePost] data', { response: JSON.stringify(data) });
        if (!data.delete) {
            logger.error('[deletePost] data.deletePost is falsy', {
                response: JSON.stringify(data),
                message: JSON.stringify({ type, postId }),
            });
            throw new Error('[deletePost] data.deletePost is falsy');
        }
    } catch (error) {
        logger.info('[deletePost] delete error', { message: error });
        throw new Error('deletePost error');
    }

    const postTag = PostCache.getPostTag(type);
    revalidateTag(postTag);

    redirect(`/`);
}

async function addFavoriteQuest(accessToken: string, questId: number) {
    const res = await fetch(`${backendURL}/quests/${questId}/increaseFavorite`, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        const logRes = new LoggableResponse(res);
        logger.error('[addFavoriteQuest] response error', {
            response: logRes,
            message: { questId },
        });
    }

    const responseData: QuestPostApiResponseDto = await res.json();
    logger.info('Backend Response', { message: responseData });
    if (
        responseData.patchQuestIncreaseFavorite === undefined ||
        typeof responseData.patchQuestIncreaseFavorite === 'string'
    ) {
        logger.error('[addFavoriteQuest] response data error', {
            message: responseData.patchQuestIncreaseFavorite,
        });
        throw new Error('[addFavoriteQuest] server error. need to check server');
    }

    return responseData.patchQuestIncreaseFavorite;
}

async function deleteFavoriteQuest(accessToken: string, questId: number) {
    const res = await fetch(`${backendURL}/quests/${questId}/decreaseFavorite`, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${accessToken}`,
        },
    });
    if (!res.ok) {
        const logRes = new LoggableResponse(res);
        logger.error('[setFavoriteQuest]\\ response error', {
            response: logRes,
            message: { questId },
        });
    }

    const responseData: QuestPostApiResponseDto = await res.json();
    logger.info('Backend Response', { message: responseData });
    if (
        responseData.patchQuestDecreaseFavorite === undefined ||
        typeof responseData.patchQuestDecreaseFavorite === 'string'
    ) {
        logger.error('[setFavoriteQuest]\\ response data error', {
            message: responseData.patchQuestIncreaseFavorite,
        });
        throw new Error('[setFavoriteQuest]\\ server error. need to check server');
    }

    return responseData.patchQuestDecreaseFavorite;
}

async function addFavoriteSb(accessToken: string, sbId: number) {
    const res = await fetch(`${backendURL}/sbs/${sbId}/increaseFavorite`, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${accessToken}`,
        },
    });

    if (!res.ok) {
        const logRes = new LoggableResponse(res);
        logger.error('[addFavoriteSb] response error', {
            response: logRes,
            message: { sbId },
        });
    }

    const responseData: SbPostApiResponseDto = await res.json();
    logger.info('Backend Response', { message: responseData });
    const temp = responseData.patchSbIncreaseFavorite;
    if (temp === undefined || typeof temp === 'string') {
        logger.error('[addFavoriteSb] response data error', { message: temp });
        throw new Error('[addFavoriteSb] server error. need to check server');
    }

    return temp;
}

async function deleteFavoriteSb(accessToken: string, sbId: number) {
    const res = await fetch(`${backendURL}/sbs/${sbId}/decreaseFavorite`, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${accessToken}`,
        },
    });
    if (!res.ok) {
        const logRes = new LoggableResponse(res);
        logger.error('[deleteFavoriteSb] response error', {
            response: logRes,
            message: { sbId },
        });
    }

    const responseData: SbPostApiResponseDto = await res.json();
    const temp = responseData.patchSbDecreaseFavorite;
    logger.info('Backend Response', { message: JSON.stringify(responseData) });
    if (temp === undefined || typeof temp === 'string') {
        logger.error('[deleteFavoriteSb] response data error', { message: temp });
        throw new Error('[deleteFavoriteSb] server error. need to check server');
    }

    return temp;
}
