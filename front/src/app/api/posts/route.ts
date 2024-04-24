import logger from "@/utils/log/logger";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { PostApiResponseDto } from "hoodone-shared";

/* TODO
- accessToken state 등으로 관리하기
    recoil 등 state management 사용권장.
- accessToken 갱신 로직 
*/
const backURL = "http://localhost:3000";
const accessTotken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndsZ2hrczU5NjZAbmF2ZXIuY29tIiwic3ViIjoyMSwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTcxMzQ5OTcxMywiZXhwIjoxNzEzNTAwMDEzfQ.hVbG3YvzUsHxWtK4x5A3JjPmY4fwBCfsx-Z7unj-RAg";

export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();
    const res = await fetch(`${backURL}/posts`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${accessTotken}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      const responseData: PostApiResponseDto = await res.json();
      logger.info("Backend Response", { message: responseData });
      return NextResponse.json(responseData);
    } else {
      logger.error("Backend Error", { message: `HTTP ${res.status}` });
      return NextResponse.json(
        { error: "POST post failed" },
        { status: res.status }
      );
    }
  } catch {
    logger.error("Backend Error", { message: "POST post failed" });
    return NextResponse.json({ error: "POST post failed" }, { status: 500 });
  }
}
