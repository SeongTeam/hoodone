import {Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, ParseIntPipe, Inject, forwardRef,
    } from '@nestjs/common';
import { QueryRunner as QR } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { User } from 'src/users/decorator/user.decorator';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { UserModel } from 'src/users/entities/user.entity';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { CreateResponseCommentDto } from './dto/create-response-comment.dto';
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
  // todo Comment.id는 1 ~ 1,000,000 ResponseComment.id는 1,000,001 ~ 2,000,000
  getComment(@Param('commentId', ParseIntPipe) commentId: number, @Body() body) {
    return this.commentUseCases.getCommentById(commentId);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async postNewComment(
    @User() user: UserModel,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: CreateCommentDto,
    @QueryRunner() qr: QR,
  ) {
    try {
      const post = await this.commentUseCases.createComment(user, postId, body, qr);

      return post;
    } catch (e) {
      throw `find error\n ${e}`;
    }
  }

  @Post(':commentId')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async postNewResponseComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: CreateResponseCommentDto,
    @User() user: UserModel,
    @QueryRunner() qr: QR,
  ) {
    try {
      const responseComment = await this.commentUseCases.createResponseComment(
        user,
        postId,
        body,
        qr,
      );

      return responseComment;
    } catch (e) {
      throw `find error\n ${e}`;
    }
  }
}
