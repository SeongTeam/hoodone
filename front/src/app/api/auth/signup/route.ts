import logger from "@/utils/log/logger";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { AuthApiResponseDto } from "hoodone-shared";

const backURL = process.env.BACKEND_URL;
/*TODO
- components/modal/auth/signUp.tsx 포함한 이메일 인증 및 계정 생성 로직 구현
*/
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { email, password } = data;
  } catch (error) {}
}
