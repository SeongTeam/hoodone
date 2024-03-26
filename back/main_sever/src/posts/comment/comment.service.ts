import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

import { ResponseCommentModel } from './entities/response_comments.entity';
import { CommentModel } from './entities/comments.entity';
import { DEFAULT_COMMENT_FIND_OPTIONS } from './const/default-comment-find-options.const';
import { DEFAULT_RESPONSE_COMMENT_FIND_OPTIONS } from './const/default-response-comment-find-options.const';
@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentModel)
    private readonly commentRepository: Repository<CommentModel>,
    @InjectRepository(ResponseCommentModel)
    private readonly responseCommentRepository: Repository<ResponseCommentModel>,
  ) {}

  async findCommentById(id: number) {
    return this.commentRepository.find({
      ...DEFAULT_COMMENT_FIND_OPTIONS,
      where: {
        id: id,
      },
    });
  }

  async findResponseCommentById(id: number) {
    return this.responseCommentRepository.find({
      ...DEFAULT_RESPONSE_COMMENT_FIND_OPTIONS,
      where: {
        id: id,
      },
    });
  }

  async loadCommentById(id: number) {
    const comment = await this.commentRepository.preload({
      id: id,
    });

    if (!comment) {
      throw new BadRequestException(`id: ${id} Comment는 존재하지 않습니다.`);
    }

    return comment;
  }

  /**
   * find가 아닌 preload를 이용햐서 Entity를 가져온다. find보다
   * (단점: relation된 Entity 가지고 올 수 없다)
   */
  async loadRespondCommentById(id: number) {
    const responseComment = await this.responseCommentRepository.preload({
      id: id,
    });

    if (!responseComment) {
      throw new BadRequestException(`id: ${id} ResponseComment는 존재하지 않습니다.`);
    }

    return responseComment;
  }

  /** 대댓글의 아이디를 부모 댓글에 저장
   *
   */
  async appendResponseCommentId(depth: number, responseCommentId: number, responseToId: number) {

    if (depth === 0) {
      const comment = await this.loadCommentById(responseToId);
      await comment.responseCommentIDs.push(responseCommentId);
      const updateComment = await this.commentRepository.save(comment);
      return updateComment;
    } else {
      const comment = await this.loadRespondCommentById(responseToId);
      await comment.responseCommentIDs.push(responseCommentId);
      const updateComment = await this.responseCommentRepository.save(comment);
      return updateComment;
    }
  }

  getCommentRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository<CommentModel>(CommentModel) : this.commentRepository;
  }
  getResponseCommentRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<ResponseCommentModel>(ResponseCommentModel)
      : this.responseCommentRepository;
  }
}
