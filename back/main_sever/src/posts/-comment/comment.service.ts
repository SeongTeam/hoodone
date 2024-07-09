import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { UserModel } from 'src/users/entities/user.entity';
import { COMMON_COMMENT_FIND_OPTION } from './const/comment-find-options.const';
import { CommentModel } from './entities/comment.entity';
import { Between } from 'typeorm';
import { PostId } from '../pips/post-id.pip';
import { PostType } from './enum/post_type';

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

    async findCommentsByPostId(postId: PostId) {
        const { questId, sbId } = this.changeToTwoPostIds(postId);
        return this.commentRepository.find({
            ...COMMON_COMMENT_FIND_OPTION,
            where: {
                questPost: { id: questId },
                sbtPost: { id: sbId },
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
    async findCommentsByPostIdWithDepth(postId: PostId, depthRange: number[]) {
        const { questId, sbId } = this.changeToTwoPostIds(postId);
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
        postId: PostId,
        qr: QueryRunner,
    ) {
        const { questId, sbId } = this.changeToTwoPostIds(postId);
        const repository = this._getRepository(qr);

        const newComment: CommentModel = repository.create({
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
        commentInfo: Pick<CommentModel, 'content' | 'responseToId'>,
        postId: PostId,
        qr: QueryRunner,
    ) {
        const { questId, sbId } = this.changeToTwoPostIds(postId);
        const repository = this._getRepository(qr);
        const responseToComment = await this.loadById(commentInfo.responseToId);
        const depth = responseToComment.depth + 1;
        const _commentIDs = responseToComment.replyCommentIds;

        if (questId && sbId) {
            throw new BadRequestException(
                'commentService.createReplyComment(), questId, sbId가 들어 있으면 안됩니다. 1개만 들어 있어야 합니다. ',
            );
        }

        if (!(questId || sbId)) {
            throw new BadRequestException('questId, sbId에 값이 모두 비어 있습니다 ');
        }

        const newComment: CommentModel = repository.create({
            questPost: {
                id: questId,
            },
            sbtPost: {
                id: sbId,
            },
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

    changeToTwoPostIds(postId: PostId) {
        const { id, postType } = postId;
        if (typeof postId === 'number') return { questId: postId, sbId: null };

        // isQuestPost을 기준으로 현재 들어온 id가 어떤 post의 id인지 확인합니다
        if (postType === PostType.QUEST) {
            return { questId: id, sbId: null };
        } else {
            return { questId: null, sbId: id };
        }
    }

    async validatePostId(
        questId: number & { __brand: 'questId' },
        sbId: number & { __brand: 'sbId' },
    ) {
        if (questId && sbId) {
            throw new BadRequestException(
                'createComment(), questId, sbId가 들어 있으면 안됩니다. 1개만 들어 있어야 합니다. ',
            );
        }

        if (!(questId || sbId)) {
            throw new BadRequestException('questId, sbId에 값이 모두 비어 있습니다 ');
        }
    }
    _getRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<CommentModel>(CommentModel) : this.commentRepository;
    }
}
