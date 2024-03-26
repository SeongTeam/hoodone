import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

import { CommentModel } from './entities/comment.entity';
import { DEFAULT_COMMENT_FIND_OPTIONS } from './const/default-comment-find-options.const';
import { UserModel } from 'src/users/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreateReplyCommentDto } from './dto/create-reply-comment.dto';
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentModel)
    private readonly commentRepository: Repository<CommentModel>,
  ) {}

  async findCommentById(id: number) {
    return this.commentRepository.find({
      ...DEFAULT_COMMENT_FIND_OPTIONS,
      where: {
        id: id,
      },
    });
  }

  async saveNewComment(comment: CommentModel, qr?: QueryRunner) {
    const commentRepository = this.getCommentRepository(qr);
    const newComment: CommentModel = await commentRepository.save(comment);

    return newComment;
  }

  async createCommentModel(author: UserModel, postId: number, createDto: CreateCommentDto) {
    const comment: CommentModel = this.commentRepository.create({
      post: {
        id: postId,
      },
      index: 0, // todo post의 댓글 리스트 갯수 만큼 index를 증가시켜야 한다.
      depth: 0,
      author,
      ...createDto,
    });
    return comment;
  }

  async createReplyCommentModel(
    author: UserModel,
    postId: number,
    createDto: CreateReplyCommentDto,
  ) {
    const responseToComment = await this.loadCommentById(createDto.responseToId);
    const _commentIDs = responseToComment.replyCommentIDs;

    const comment: CommentModel = this.commentRepository.create({
      post: {
        id: postId,
      },
      responseToId: createDto.responseToId,
      index: _commentIDs.length,
      author,
      ...createDto,
    });
    return comment;
  }

  async loadCommentById(id: number) {
    const comment: CommentModel = await this.commentRepository.preload({
      id: id,
    });

    if (!comment) {
      throw new BadRequestException(`id: ${id} Comment는 존재하지 않습니다.`);
    }

    return comment;
  }

  /** 대댓글의 아이디를 부모 댓글에 저장*/
  async appendReplyCommentId(depth: number, replyCommentId: number, responseToId: number) {
    const comment = await this.loadCommentById(responseToId);
    await comment.replyCommentIDs.push(replyCommentId);
    const updatedComment: CommentModel = await this.commentRepository.save(comment);
    return updatedComment;
  }

  getCommentRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository<CommentModel>(CommentModel) : this.commentRepository;
  }
}
