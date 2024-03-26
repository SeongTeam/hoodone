import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

import { CommentModel } from './entities/comments.entity';
import { DEFAULT_COMMENT_FIND_OPTIONS } from './const/default-comment-find-options.const';
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


  async loadCommentById(id: number) {
    const comment = await this.commentRepository.preload({
      id: id,
    });

    if (!comment) {
      throw new BadRequestException(`id: ${id} Comment는 존재하지 않습니다.`);
    }

    return comment;
  }

  /** 대댓글의 아이디를 부모 댓글에 저장*/
  async appendResponseCommentId(depth: number, responseCommentId: number, responseToId: number) {


      const comment = await this.loadCommentById(responseToId);
      await comment.responseCommentIDs.push(responseCommentId);
      const updateComment = await this.commentRepository.save(comment);
      return updateComment;
  }

  getCommentRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository<CommentModel>(CommentModel) : this.commentRepository;
  }
}
