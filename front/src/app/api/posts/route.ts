import logger from '@/utils/log/logger';

import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { PostApiResponseDto } from 'hoodone-shared';
import { PostType } from '@/atoms/post';
import { getCachedPaginatedPosts } from '@/lib/server-only/postLib';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const offset = searchParams.get('offset');
    const limit = searchParams.get('limit');

    try {
        if (!offset) {
            throw new Error('offset or limit not found');
        }
        const posts: PostType[] | null = await getCachedPaginatedPosts(parseInt(offset));

        return NextResponse.json(posts);
    } catch (error) {
        logger.error('Error getPaginatedPosts', { message: error });
        return NextResponse.json({ message: error });
    }
}
