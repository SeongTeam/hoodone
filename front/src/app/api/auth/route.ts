import logger from "@/utils/log/logger";
import { NextResponse } from "next/server";

/* TODO
- Auth backend API 만들기
- Data fetching 참고
  ref : https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
*/
export async function POST(request: Request) {
  logger.error("Error message");

  return NextResponse.json({ message: "Hello, Next.js!" });
}
