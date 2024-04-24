import logger from "@/utils/log/logger";
import { NextResponse } from "next/server";
import { AuthApiResponseDto } from "hoodone-shared";
import { type NextRequest } from "next/server";
import { cookies } from "next/headers";

const backURL = process.env.BACKEND_URL;
/*TODO
- backend응답으로 받은 accessToken과 resfreshToken 반환 후, 처리할 로직 구현하기.
*/
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { email, password } = data;

    const basicAuthToken = `${email}:${password}`;

    const res = await fetch(`${backURL}/auth/login/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(basicAuthToken)}`,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (res.ok) {
      const responseData: AuthApiResponseDto = await res.json();
      logger.info("Backend Response", { message: responseData });

      const { accessToken, refreshToken } = responseData.postLoginEmail!;

      const accessTokenCookie = cookies().set({
        name: "accessToken",
        value: accessToken,
        maxAge: 60 * 60 * 2,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      const rereshTokenCookie = cookies().set({
        name: "refreshToken",
        value: refreshToken,
        maxAge: 60 * 60 * 24,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      return NextResponse.json(
        { message: "Autehntication succesful" },
        {
          headers: {
            "Set-Cookie": [accessTokenCookie, rereshTokenCookie].join("; "),
          },
        }
      );
    } else {
      logger.error("Backend Error", { message: `HTTP ${res.status}` });
      return NextResponse.json(
        { error: "Authenication failed. please check email and password" },
        { status: res.status }
      );
    }

    //return NextResponse.json({ email, password, message: "Hello, Next.js!" });
  } catch (error) {
    logger.error("Internal Server Error", { message: error });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
