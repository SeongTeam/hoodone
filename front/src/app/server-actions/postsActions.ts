"use server";
import { v2 as cloudinary } from "cloudinary";
import logger from "@/utils/log/logger";
import { NextResponse } from "next/server";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PostApiResponseDto } from "hoodone-shared";
import { PostType } from "@/atoms/post";
import { revalidateTag } from "next/cache";

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

    if ("error" in uploadResult) {
      logger.error("Cloudinary upload error", { message: uploadResult });
      new Error("Cloudinary upload error");
    }

    return uploadResult;
  } catch (error) {
    logger.error("cloudinary.config(): ", cloudinary.config());
    logger.error("uploadThumbnail error", { message: error });
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
    const newPost = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
    } as PostType;
    const Image = formData.get("image") as File;
    if (Image && Image.size > 0) {
      const uploadResult = await uploadThumbnail(Image);
      newPost.publicID = uploadResult?.public_id;
    }
    const accessToken = cookies().get("accessToken")?.value;
    const refreshToken = cookies().get("refreshToken")?.value;

    const res = await fetch(`${backendURL}/posts`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(newPost),
    });

    if (!res.ok) {
      logger.error("[createPosts] response is not ok. status:", {
        message: res.status,
      });
      throw new Error("createPosts error");
    }
  } catch (error) {
    logger.error("createPosts error", { message: error });
    return null;
  }

  revalidateTag("Allposts");
  //redirect("/");
}

/*TODO
- Next Sever에서 posts[] 메모리에 저장 구현
  - client가 특정 post에 접근시도시, next server에 저장된 post[]에서 탐색후 반환
*/
export async function getAllPosts() {
  try {
    const res = await fetch(`${backendURL}/posts/all`, {
      next: { tags: ["Allposts"] },
    });
    if (!res.ok) {
      logger.error("getPosts error", { message: res });
      throw new Error("getPosts error");
    }
    const posts = await res.json();
    console.log("getAllPosts", posts);
    return posts;
  } catch (error) {
    logger.error("getPosts error", { message: error });
    return null;
  }
}

/*TODO
- Post 가져오는 로직 최적화 하기
  option1) Next Sever의 post[]에서 postID 탐색하여 가져오도록 수정 고려
  option2) Next Cache 활용
*/
export async function getPostWithID(id: string) {
  try {
    const res = await fetch(`${backendURL}/posts/${id}`);

    if (!res.ok) {
      logger.error("getPostWithID error", { message: res });
      throw new Error("getPostWithID error");
    }

    const data: PostApiResponseDto = await res.json();
    console.log("getPostWithID", data);
    return data.getById as PostType;
  } catch (error) {
    logger.error("getPostWithID error", { message: error });
    return null;
  }
}
