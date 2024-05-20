import { NextRequest, NextResponse } from 'next/server';
import jwtMiddleware from './app/middleware/jwt-middleware';

export async function middleware(request: NextRequest) {
    console.log(`_____middleware working_____`);

    //TODO) 회원 인증이 필요한 서비스 path에서 불러 올 수 있도록
    if (request.nextUrl.pathname.startsWith('/api')) {
        return jwtMiddleware(request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [`/api/auth/login/`, '/api/mock/post/'],
};
