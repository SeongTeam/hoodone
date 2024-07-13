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
} from '@/type/postType';
import { revalidateTag } from 'next/cache';
import { assert, log } from 'console';
import { validateAuth } from '@/lib/server-only/authLib';
import { getUserBasicInfo } from '@/lib/server-only/authLib';
import { validateImage, uploadQuestImage, uploadSubmissionImage } from '@/utils/cloudinary/lib';
import { cloudinaryTempData } from '@/utils/cloudinary/mockUpData';
import { responseData } from '@/type/server-action/responseType';
import { PostApiResponseDto } from 'hoodone-shared';
import { PostCache } from '@/lib/server-only/postLib';

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

        await uploadImage(imageFile, type, postDto);

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

        const postTag = PostCache.getPostTag(type);
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

export async function addFavorite(postType: POST_TYPE, questId: number, postOffset: number) {
    const ret: responseData = {
        ok: false,
        message: '',
        response: { favoriteQuestIds: [] as number[] },
    };

    try {
        const accessToken = await validateAuth();

        const res = await fetch(`${backendURL}/quests/${questId}/increaseFavorite`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${accessToken}`,
            },
        });
        // Logger.error(`registerWithEmail() =>>> ${JSON.stringify(newUser)}`);

        // logger.info(' deleteFavorite res ', { message: `${res.text()}` });
        if (res.ok) {
            const responseData: PostApiResponseDto = await res.json();
            logger.info('addFavorite Response', { message: responseData });
            ret.response = responseData;
            ret.ok = true;
            const pageTag = PostCache.getPaginatedTag(postType, postOffset);
            revalidateTag(pageTag);
        } else {
            const data = await res.json();
            logger.error('addFavorite Error', {
                message: `deleteFavorite() :  ${JSON.stringify(data)}`,
            });
            ret.message = `favorite 취소 실패`;
        }

        return ret;
    } catch (error) {
        logger.info('addFavorite error', { message: error });

        throw new Error('addFavorite error');
    }
}

export async function deleteFavorite(postType: POST_TYPE, questId: number, postOffset: number) {
    const ret: responseData = {
        ok: false,
        message: '',
        response: { favoriteQuestIds: [] },
    };

    try {
        const accessToken = await validateAuth();

        const res = await fetch(`${backendURL}/quests/${questId}/decreaseFavorite`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${accessToken}`,
            },
        });

        if (res.ok) {
            const responseData: PostApiResponseDto = await res.json();
            logger.info('Backend Response', { message: responseData });
            ret.response = responseData;
            ret.ok = true;
            const pageTag = PostCache.getPaginatedTag(postType, postOffset);
            revalidateTag(pageTag);
        } else {
            const data = await res.json();
            logger.error('Backend Error', {
                message: `deleteFavorite() :  ${JSON.stringify(data)}`,
            });
            ret.message = `favorite 취소 실패`;
        }

        return ret;
    } catch (error) {
        logger.info('deleteFavorite error', { message: error });
        throw new Error('deleteFavorite error');
    }
}
