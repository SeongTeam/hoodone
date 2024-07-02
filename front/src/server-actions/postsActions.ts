'use server';
import logger from '@/utils/log/logger';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PostType, NEW_POST_FORMAT, POST_TYPE, NewPostFormType } from '@/type/postType';
import { revalidateTag } from 'next/cache';
import { assert, log } from 'console';
import { validateAuth } from '@/lib/server-only/authLib';
import { getUserBasicInfo } from '@/lib/server-only/authLib';
import { validateImage, uploadQuestImage, uploadSubmissionImage } from '@/utils/cloudinary/lib';

/*
ref : https://www.youtube.com/watch?v=5L5YoFm1obk

*/

/*TODO
- upload_stream() 과 buffer 활용 이해하기.
- 응답에 Public ID 담아서 보내기
- 삭제 로직 구현하기
*/

const backendURL = process.env.BACKEND_URL;

export async function createPosts(formData: FormData) {
    /*TODO 
    - tag : string[] 타입 전송 구현하기
    - upload 실패 예외처리 로직 구현
      - 발생한 에러 명확한 정보 logger로 출력
      - 예외 상황에 따른 시나리오 고려 및 구현
    - 테스트 진행하기
        - 테스트 진행을 위해서 login 로직필요
        - 
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

        const postDto: NewPostFormType = JSON.parse(postDtoString);

        const newPost = {
            title: postDto.title,
            content: postDto.content,
            tags: postDto.tags,
        } as PostType;
        const accessToken = await validateAuth();
        const type = postDto.type;

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
        }
        /*TODO
        - token get 실패시, 홈이동 > 로그인 창 오픈. 
        */

        switch (type) {
            case POST_TYPE.QUEST:
                res = await formQuest(accessToken, newPost);
                break;
            case POST_TYPE.SB:
                res = await formSubmissions(accessToken, newPost);
                break;
            default:
                logger.error('[createPosts] POST_TYPE is invalid. type = ', type);
                throw new Error('[createPosts] POST_TYPE error');
                break;
        }

        if (!res.ok) {
            logger.error('[createPosts] response is not ok. status', {
                message: res.status,
            });
            logger.info('res: ', { message: res });
            logger.info('newPost: ', { message: newPost });
            throw new Error('createPosts error');
        }
        revalidateTag(type === POST_TYPE.QUEST ? POST_TYPE.QUEST : POST_TYPE.SB);
    } catch (error) {
        logger.error('createPosts error', { message: error });
        return null;
    }

    redirect('/');
}

async function formQuest(accessToken: string, newPost: PostType) {
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

async function formSubmissions(accessToken: string, newPost: PostType) {
    let res: Response;
    try {
        res = await fetch(`${backendURL}/sbs`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(newPost),
        });

        return res;
    } catch (error) {
        logger.error('formSubmissions error', { message: error });
        throw new Error('formSubmissions error');
    }
}
