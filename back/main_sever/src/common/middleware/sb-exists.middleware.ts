import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { QuestPostsService } from 'src/posts/-quest/quest_post.service';

@Injectable()
export class SbExistsMiddelware implements NestMiddleware {
    constructor(private readonly postService: QuestPostsService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const postId = req.params.postId;

        if (!postId) {
            throw new BadRequestException('SbPost ID 파라미터는 필수입니다.');
        }

        const exists = await this.postService.hasExistedId(parseInt(postId));

        if (!exists) {
            throw new BadRequestException('SbPost가 존재하지 않습니다.');
        }

        next();
    }
}
