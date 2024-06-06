'use server';
import { v2 as cloudinary } from 'cloudinary';
import logger from '@/utils/log/logger';
import { NextResponse } from 'next/server';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { PostType } from '@/atoms/post';
import { revalidateTag } from 'next/cache';
import { assert } from 'console';
import { validateAuth } from '@/lib/server-only/authLib';

/*
ref : https://www.youtube.com/watch?v=5L5YoFm1obk

*/

/*TODO
- upload_stream() 과 buffer 활용 이해하기.
- 응답에 Public ID 담아서 보내기
- 삭제 로직 구현하기
*/

const configCld = {
    secure: true,
};

cloudinary.config({
    ...configCld,
});

type UploadResult = UploadApiResponse | UploadApiErrorResponse;

const backendURL = process.env.BACKEND_URL;

async function uploadThumbnail(ImageFile: File) {
    /*TODO
  - upload_stream 에러 발생 예외처리 추가 
  */
    try {
        const arrayBuffer = await ImageFile.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        const uploadResult: UploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({}, (error, result) => {
                    if (error) {
                        reject(error as UploadApiErrorResponse);
                        return;
                    }
                    resolve(result as UploadApiResponse);
                })
                .end(buffer);
        });

        if ('error' in uploadResult) {
            logger.error('Cloudinary upload error', { message: uploadResult });
            new Error('Cloudinary upload error');
        }

        return uploadResult;
    } catch (error) {
        logger.error('cloudinary.config(): ', cloudinary.config());
        logger.error('uploadThumbnail error', { message: error });
        return null;
    }
}

export async function createPosts(formData: FormData) {
    /*TODO 
    - NickName으로 변경 필요
    - Date() 시간 기준은 서버 응답 기준인가, 클라이언트측의 앱 실행 기준인가 확인필요
              - image upload 로직 구현
    - clouldinray의 public id DB에 저장하기
    - upload 실패 예외처리 로직 구현
      - 발생한 에러 명확한 정보 logger로 출력
      - 예외 상황에 따른 시나리오 고려 및 구현
  */
    try {
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;

        assert(title && title.length > 0, 'title should be not empty');
        assert(content && content.length > 0, 'content should be not empty');

        const newPost = {
            title,
            content,
        } as PostType;

        const Image = formData.get('image') as File;
        if (Image && Image.size > 0) {
            const uploadResult = await uploadThumbnail(Image);
            newPost.thumbnailPublicID = uploadResult?.public_id;
        }
        /*TODO
        - token get 실패시, 홈이동 > 로그인 창 오픈.
        */
        const accessToken = await validateAuth();

        const res = await fetch(`${backendURL}/posts`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(newPost),
        });

        if (!res.ok) {
            logger.error('[createPosts] response is not ok. status', {
                message: res.status,
            });
            throw new Error('createPosts error');
        }
    } catch (error) {
        logger.error('createPosts error', { message: error });
        return null;
    }

    revalidateTag('all-posts');
    redirect('/');
}
