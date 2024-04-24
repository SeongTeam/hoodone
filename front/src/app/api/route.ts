import logger from "@/utils/log/logger";

import { NextResponse } from "next/server";

export async function GET() {
  logger.info("GET");

  const res = await fetch("http://localhost:3000/");

  logger.info("res", { message: res });

  return NextResponse.json({ message: res });
}
