import { CommentApiResponseDto } from 'hoodone-shared';
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
    Patch,
    Delete,
    Logger,
    Query,
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
import { CommentUseCase } from './usecase/comment.use-case';
import { Roles } from 'src/users/decorator/roles.decorator';
import { RoleType } from 'src/users/const/role.type';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { CommentOwnerGuard } from './guard/comment-owner.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PostId, PostIdPip, PostType } from '../pips/post-id.pip';

/** 

TODO comment는 controller까지 분리하여서 사용, 
1. comment도 model을 나눠서 사용한다. 하지만 유저는 그런 것을 느끼지 못하게 만들단
* */
@Controller('posts/:postId/comments')
export class CommentsController {
    constructor(
        @Inject(forwardRef(() => CommentUseCase))
        private readonly commentUseCases: CommentUseCase,
    ) {}
    @Post()
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(TransactionInterceptor)
    async postComment(
        @User() user: UserModel,
        @Param('postId', PostIdPip) postId: PostId,
        @Body() createDto: CreateCommentDto,
        @QueryRunner() qr: QR,
    ) {
        try {
            const { content } = createDto;
            let res = new CommentApiResponseDto();

            res.post = await this.commentUseCases.createComment(user, postId, { content }, qr);
            return res;
        } catch (e) {
            console.log(e);
        }
    }

    @Post('/reply')
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(TransactionInterceptor)
    async postReplyComment(
        @Param('postId', PostIdPip) postId: PostId,
        @Body() createDto: CreateReplyCommentDto,
        @User() user: UserModel,
        @QueryRunner() qr: QR,
    ) {
        let res = new CommentApiResponseDto();
        res.postReply = await this.commentUseCases.createReplyComment(user, postId, createDto, qr);

        return res;
    }

    /*
    반환값 : nested comment 형식으로 그룹화된 comment list 반환
    */
    @Get('/range')
    async getCommentsByRange(
        @Param('postId', ParseIntPipe) postId: number,
        @Query('depthBegin') depthBegin: number,
        @Query('depthEnd') depthEnd: number,
    ) {
        const res = new CommentApiResponseDto();
        const depthRange = [depthBegin, depthEnd];
        res.getCommentsByRange = await this.commentUseCases.getGroupedCommentsByPostIdWithRange(
            postId,
            depthRange,
        );
        return res;
    }

    @Get('/all')
    async getAllComments(@Param('postId', ParseIntPipe) postId: number) {
        const res = new CommentApiResponseDto();
        res.getAllComments = await this.commentUseCases.getCommentsByPostId(postId);

        return res;
    }
    @Get('/reply')
    async getReplyComments(
        @Param('postId', ParseIntPipe) postId: number,
        @Query('commentId', ParseIntPipe) commentId: number,
        @Query('limit', ParseIntPipe) limit: number,
    ) {
        const res = new CommentApiResponseDto();
        res.getReplyComments = await this.commentUseCases.getReplyComments(
            postId,
            commentId,
            limit,
        );
        return res;
    }

    /** Comment와 ResponseComment를 id로 찾는 API는 1개로 설정
     * Body.depth로 어떤 table에 접속할지 확인한다.
     */
    @Get(':commentId')
    @IsPublic()
    async getComment(@Param('commentId', ParseIntPipe) commentId: number) {
        let res = new CommentApiResponseDto();
        res.getById = await this.commentUseCases.getById(commentId);

        return res;
    }

    @Patch(':id')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @UseGuards(AccessTokenGuard, CommentOwnerGuard, RoleGuard)
    @UseInterceptors(TransactionInterceptor)
    async patch(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdateCommentDto,
        @QueryRunner() qr: QR,
    ) {
        return this.commentUseCases.update(id, body, qr);
    }

    @Delete(':id')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @UseGuards(AccessTokenGuard, CommentOwnerGuard, RoleGuard)
    @UseInterceptors(TransactionInterceptor)
    delete(@Param('id', ParseIntPipe) id: number, @QueryRunner() qr: QR) {
        return this.commentUseCases.softdelete(id, qr);
    }
}
