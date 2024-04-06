import { Inject, Injectable } from '@nestjs/common/decorators';
import { BadRequestException, InternalServerErrorException, forwardRef } from '@nestjs/common';
import { UserModel } from 'src/users/entities/user.entity';
import { QueryRunner } from 'typeorm';

import { CommentsService } from '../comment.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CreateReplyCommentDto as CreateReplyCommentDto } from '../dto/create-reply-comment.dto';
import { PostsService } from 'src/posts/post.service';
import { CommentModel } from '../entities/comment.entity';
import { PostsUseCases } from 'src/posts/usecase/post.use-case';

@Injectable()
export class CommentUseCases {
  constructor(
    private readonly commentService: CommentsService,
    private readonly postUseCase: PostsUseCases,
  ) {}

  async createComment(
    author: UserModel,
    postId: number,
    createCommentDto: CreateCommentDto,
    qr?: QueryRunner,
  ) {
    try {
      const _comment: CommentModel = await this.commentService.createCommentModel(
        author,
        postId,
        createCommentDto,
      );
      const newComment = this.commentService.saveNewComment(_comment, qr);
      await this.postUseCase.incrementCommentCount(postId, qr);

      return newComment;
    } catch (e) {
      throw new InternalServerErrorException(`CommentUseCases.createComment() error \n${e}`);
    }
  }

  async createReplyComment(
    author: UserModel,
    postId: number, // todo 가능하면 createDto안에 집어 넣자
    createDto: CreateReplyCommentDto,
    qr?: QueryRunner,
  ) {
    let _commentIDs: number[];
    try {
      const commentRepository = this.commentService.getCommentRepository(qr);

      // depth의 값에 따라서 댓글 관계가 확인 0이면 댓글, depth가 1이상이면 대댓글
      const replyComment: CommentModel = await this.commentService.createReplyCommentModel(
        author,
        postId,
        createDto,
      );
      replyComment.depth++; // depth 값을 1 올려서 저장

      const newReplyComment = await commentRepository.save(replyComment);
      this.commentService.appendReplyCommentId(
        createDto.depth,
        newReplyComment.id,
        createDto.responseToId,
      );

      await this.postUseCase.incrementCommentCount(postId, qr);

      return newReplyComment;
    } catch (e) {
      throw new InternalServerErrorException(`commentService error \n${e}`);
    }
  }

  getCommentById(commentId: number) {
    return this.commentService.findCommentById(commentId);
  }
}
