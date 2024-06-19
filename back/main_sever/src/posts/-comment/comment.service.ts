import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { UserModel } from 'src/users/entities/user.entity';
import { COMMON_COMMENT_FIND_OPTION } from './const/comment-find-options.const';
import { CommentModel } from './entities/comment.entity';
import { Between } from 'typeorm';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(CommentModel)
        private readonly commentRepository: Repository<CommentModel>,
    ) {}

    async findById(id: number) {
        return this.commentRepository.findOne({
            ...COMMON_COMMENT_FIND_OPTION,
            where: {
                id: id,
            },
        });
    }

    async findCommentsByUserId(userId: number) {
        return this.commentRepository.find({
            ...COMMON_COMMENT_FIND_OPTION,
            where: {
                author: { id: userId },
            },
        });
    }

    async findCommentsByPostId(postId: number) {
        return this.commentRepository.find({
            ...COMMON_COMMENT_FIND_OPTION,
            where: {
                // post: { id: postId },
            },
            order: {
                responseToId: 'ASC',
                depth: 'ASC',
                index: 'ASC',
                createdAt: 'ASC',
            },
        });
    }
    async findCommentsByPostIdWithDepth(postId: number, depthRange: number[]) {
        if (depthRange.length !== 2) {
            throw new BadRequestException('depthRange is wrong');
        }
        if (depthRange[0] > depthRange[1]) {
            throw new BadRequestException('depthRange is wrong');
        }
        return this.commentRepository.find({
            ...COMMON_COMMENT_FIND_OPTION,
            where: {
                // post: { id: postId },
                depth: Between(depthRange[0], depthRange[1]),
            },
            order: {
                responseToId: 'ASC',
                depth: 'ASC',
                index: 'ASC',
                createdAt: 'ASC',
            },
        });
    }

    /**댓글과 대댓글을 생성하는 메서드는 다르지만 저장하는 메서드는 동일
     *
     * 댓글과 대댓글은 같은 table에 저장되기 떄문에 save() 하나로 사용 가능
     */
    async save(comment: CommentModel, qr: QueryRunner) {
        const commentRepository = this._getRepository(qr);
        const newComment: CommentModel = await commentRepository.save(comment);

        return newComment;
    }

    /**Comment를 생성, DB에 저장하지 않습니다
     *
     * 저장을 원한다면 saveComment()를 사용하세요
     */
    async createComment(
        author: UserModel,
        commentInfo: Pick<CommentModel, 'content'>,
        // postId?: number ,
        postId?: { questId?: number; sbId?: number },
    ) {
        const { questId, sbId } = postId;

        // TODO 새로운 exception 정의하지
        if (questId && sbId) {
            throw new BadRequestException(
                'createComment(), questId, sbId가 들어 있으면 안됩니다. 1개만 들어 있어야 합니다. ',
            );
        }

        const newComment: CommentModel = this.commentRepository.create({
            // post: {
            //     id: postId,
            // },
            questPost: {
                id: questId,
            },
            sbtPost: {
                id: sbId,
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
        commentInfo: Pick<CommentModel, 'content' | 'responseToId'>,
        qr: QueryRunner,
    ) {
        const repository = this._getRepository(qr);
        const responseToComment = await this.loadById(commentInfo.responseToId);
        const depth = responseToComment.depth + 1;
        const _commentIDs = responseToComment.replyCommentIds;

        const newComment: CommentModel = repository.create({
            // post: {
            //     id: postId,
            // },
            responseToId: commentInfo.responseToId,
            index: _commentIDs.length,
            author,
            ...commentInfo,
            depth,
        });
        return newComment;
    }

    async delete(comment: CommentModel, qr: QueryRunner) {
        const repository = this._getRepository(qr);
        return await repository.softRemove(comment);
    }

    async deletePermanently(commentId: number, qr: QueryRunner) {
        const repository = this._getRepository(qr);
        return await repository.delete(commentId);
    }
    /** 수정 삭제 시에는 loadById()를 사용 */
    async loadById(id: number) {
        const comment: CommentModel = await this.commentRepository.findOneBy({
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
        await comment.replyCommentIds.push(replyCommentId);
        const updatedComment: CommentModel = await this.commentRepository.save(comment);
        return updatedComment;
    }

    async isCommentOwner(userId: number, commentId: number) {
        return this.commentRepository.exists({
            where: {
                id: commentId,
                author: {
                    id: userId,
                },
            },
            relations: {
                author: true,
            },
        });
    }

    _getRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<CommentModel>(CommentModel) : this.commentRepository;
    }
}
