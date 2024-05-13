import "server-only";
import logger from "@/utils/log/logger";
import { AuthApiResponseDto } from "hoodone-shared";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

/*TODO
- backend 서버에서 accessToken과 resfreshToken 수신시, 만료기간 수신도 파악하기.
- session 관리 로직 추가
    - accessToken , refresh 토큰 갱신 로직
ref : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndsZ2hrczU5NjZAbmF2ZXIuY29tIiwic3ViIjoyMSwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTcxMzQ5OTcxMywiZXhwIjoxNzEzNTAwMDEzfQ.hVbG3YvzUsHxWtK4x5A3JjPmY4fwBCfsx-Z7unj-RAg
- 참조페이지는 JWT 생성로직까지 포함한 백엔드 로직이므로, 적절히 분리하여 필요한것만 취할것.
*/

export function isAccessTokenExpired(expiresAt: number): boolean {
  /*TODO isAccessTokenExpired()
- AWS 배포시, 서버와 클라이언트(브라우저 등)의 Date.now() 동기화여부 확인하기.
*/
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime > expiresAt;
}

/*TODO
- 하기 함수 테스트 필요.
*/
export async function refreshAccessToken(
  endpoint: string,
  refreshToken: string
) {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (res.ok) {
      const data: AuthApiResponseDto = await res.json();
      const newAccessToken = data.postTokenAccess;
      return newAccessToken;
    } else {
      throw new Error("Refresh accessToken failed");
    }
  } catch (error) {
    logger.error("Error refreshing accessToken", { message: error });
    return null;
  }
}

export async function refreshRefreshToken(
  endpoint: string,
  refreshToken: string
) {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (res.ok) {
      const data: AuthApiResponseDto = await res.json();
      const newRefreshToken = data.postTokenAccess;
      return newRefreshToken;
    } else {
      throw new Error("Refresh refreshToken failed");
    }
  } catch (error) {
    logger.error("Error refreshing refreshToken", { message: error });
    return null;
  }
}

export function getAccessToken(
  request: NextRequest
): {
  accessToken: string | undefined;
  refreshToken: string | undefined;
} | null {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (accessToken && refreshToken) {
    return { accessToken, refreshToken };
  } else {
    return null;
  }
}
