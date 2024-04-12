import { CommentApiResponseDto } from '../../../../../share/response-dto/comment-api-response.dto';
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
    @Get(':id')
    @IsPublic()
    async getComment(@Param('commentId', ParseIntPipe) commentId: number, @Body() body) {
        let res = new CommentApiResponseDto();
        res.getById = await this.commentUseCases.getById(commentId);

        return res;
    }

    @Post()
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(TransactionInterceptor)
    async postComment(
        @User() user: UserModel,
        @Param('postId', ParseIntPipe) postId: number,
        @Body() createDto: CreateCommentDto,
        @QueryRunner() qr: QR,
    ) {
        let res = new CommentApiResponseDto();
        res.getById = await this.commentUseCases.createComment(user, postId, createDto, qr);

        return res;
    }

    @Post('/reply')
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(TransactionInterceptor)
    async postReplyComment(
        @Param('postId', ParseIntPipe) postId: number,
        @Body() creatDto: CreateReplyCommentDto,
        @User() user: UserModel,
        @QueryRunner() qr: QR,
    ) {
        let res = new CommentApiResponseDto();
        res.postReply = await this.commentUseCases.createReplyComment(user, postId, creatDto, qr);

        return res;
    }
}
