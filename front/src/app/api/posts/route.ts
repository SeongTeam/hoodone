import logger from '@/utils/log/logger';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { POST_TYPE } from '@/components/posts/postType';
import { PostFetchService } from '@/components/posts/postLib';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const offsetStr = searchParams.get('offset');
    const type: POST_TYPE | null = searchParams.get('type') as POST_TYPE;

    if (type === null) {
        logger.error('type not found', { message: { type } });
        return NextResponse.json({ message: 'type not found' }, { status: 404 });
    }

    if (!offsetStr) {
        logger.error('offset not found', { message: { offsetStr } });
        return NextResponse.json({ message: 'offset not found' }, { status: 404 });
    }

    const service = new PostFetchService(type);
    const offset = parseInt(offsetStr);

    try {
        if (!offset) {
            throw new Error('offset or limit not found');
        }

        const posts = await service.getCachedPaginatedPosts(offset);

        return NextResponse.json(posts);
    } catch (error) {
        logger.error('Route hanlder error. path : /api/posts GET', { message: error });
        return NextResponse.json({ message: error });
    }
}
