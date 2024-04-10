import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

import { UserModel } from 'src/users/entities/user.entity';

import { COMMON_COMMENT_FIND_OPTION } from './const/comment-find-options.const';
import { CommentModel } from './entities/comment.entity';
@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentModel)
        private readonly commentRepository: Repository<CommentModel>,
    ) {}

    async findById(id: number) {
        return this.commentRepository.find({
            ...COMMON_COMMENT_FIND_OPTION,
            where: {
                id: id,
            },
        });
    }

    /**댓글과 대댓글을 생성하는 메서드는 다르지만 저장하는 메서드는 동일
     *
     * 댓글과 대댓글은 같은 table에 저장되기 떄문에 save() 하나로 사용 가능
     */
    async save(comment: CommentModel, qr: QueryRunner) {
        const commentRepository = this._getCommentRepository(qr);
        const newComment: CommentModel = await commentRepository.save(comment);

        return newComment;
    }

    /**Comment를 생성, DB에 저장하지 않습니다
     *
     * 저장을 원한다면 saveComment()를 사용하세요
     */
    async createComment(
        author: UserModel,
        postId: number,
        commentInfo: Pick<CommentModel, 'content'>,
    ) {
        const newComment: CommentModel = this.commentRepository.create({
            post: {
                id: postId,
            },
            index: 0, // TODO): post의 댓글 리스트 갯수 만큼 index를 증가시켜야 한다.
            depth: 0,
            author,
            ...commentInfo,
        });
        return newComment;
    }
    /**reply Comment를 생성, DB에 저장하지 않습니다
     *
     * 저장을 원한다면 saveComment()를 사용하세요
     */
    async createReplyComment(
        author: UserModel,
        postId: number,
        commentInfo: Pick<CommentModel, 'content' | 'responseToId' | 'depth'>,
        qr: QueryRunner,
    ) {
        const repository = this._getCommentRepository(qr);
        const responseToComment = await this.loadById(commentInfo.responseToId);
        const _commentIDs = responseToComment.replyCommentIDs;

        const newComment: CommentModel = repository.create({
            post: {
                id: postId,
            },
            responseToId: commentInfo.responseToId,
            index: _commentIDs.length,
            author,
            ...commentInfo,
        });
        return newComment;
    }

    async loadById(id: number) {
        const comment: CommentModel = await this.commentRepository.preload({
            id: id,
        });

        if (!comment) {
            throw new BadRequestException(`id: ${id} Comment는 존재하지 않습니다.`);
        }

        return comment;
    }

    /** 대댓글의 아이디를 부모 댓글에 저장*/
    async appendReplyCommentId(replyCommentId: number, responseToId: number) {
        const comment = await this.loadById(responseToId);
        await comment.replyCommentIDs.push(replyCommentId);
        const updatedComment: CommentModel = await this.commentRepository.save(comment);
        return updatedComment;
    }

    _getCommentRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<CommentModel>(CommentModel) : this.commentRepository;
    }
}
