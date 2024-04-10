import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
    UseInterceptors,
    ParseIntPipe,
    Inject,
    forwardRef,
} from '@nestjs/common';
import { QueryRunner as QR } from 'typeorm';

import { AccessTokenGuard } from 'src/auth/guard/token/access-token.guard';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { User } from 'src/users/decorator/user.decorator';
import { UserModel } from 'src/users/entities/user.entity';

import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateReplyCommentDto } from './dto/create-reply-comment.dto';
import { CommentUseCases } from './usecase/comment.use-case';

@Controller('posts/:postId/comment')
export class CommentsController {
    constructor(
        @Inject(forwardRef(() => CommentUseCases))
        private readonly commentUseCases: CommentUseCases,
    ) {}

    /** Comment와 ResponseComment를 id로 찾는 API는 1개로 설정
     * Body.depth로 어떤 table에 접속할지 확인한다.
     */
    @Get(':commentId')
    @IsPublic()
    getComment(@Param('commentId', ParseIntPipe) commentId: number, @Body() body) {
        return this.commentUseCases.getById(commentId);
    }

    @Post()
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(TransactionInterceptor)
    async postNewComment(
        @User() user: UserModel,
        @Param('postId', ParseIntPipe) postId: number,
        @Body() createDto: CreateCommentDto,
        @QueryRunner() qr: QR,
    ) {
        try {
            const post = await this.commentUseCases.createComment(user, postId, createDto, qr);

            return post;
        } catch (e) {
            throw `find error\n ${e}`;
        }
    }

    @Post(':commentId')
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(TransactionInterceptor)
    async postNewReplyComment(
        @Param('postId', ParseIntPipe) postId: number,
        @Body() creatDto: CreateReplyCommentDto,
        @User() user: UserModel,
        @QueryRunner() qr: QR,
    ) {
        try {
            const replyComment = await this.commentUseCases.createReplyComment(
                user,
                postId,
                creatDto,
                qr,
            );

            return replyComment;
        } catch (e) {
            throw `find error\n ${e}`;
        }
    }
}
