import { Injectable } from '@nestjs/common/decorators';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserModel } from 'src/users/entities/user.entity';
import { QueryRunner } from 'typeorm';

import { CommentsService } from '../comment.service';
import { CommentModel } from '../entities/comment.entity';
import { PostsUseCases } from 'src/posts/usecase/post.use-case';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Injectable()
export class CommentUseCase {
    constructor(
        private readonly commentService: CommentsService,
        private readonly postUseCase: PostsUseCases,
    ) {}

    async createComment(
        author: UserModel,
        postId: number,
        commentInfo: Pick<CommentModel, 'content'>,
        qr?: QueryRunner,
    ) {
        try {
            const _comment: CommentModel = await this.commentService.createComment(
                author,
                postId,
                commentInfo,
            );
            const newComment = this.commentService.save(_comment, qr);
            await this.postUseCase.incrementCommentCount(postId, qr);

            return newComment;
        } catch (e) {
            throw new InternalServerErrorException(`CommentUseCases.createComment() error \n${e}`);
        }
    }

    async createReplyComment(
        author: UserModel,
        postId: number, // todo 가능하면 createDto안에 집어 넣자
        commentInfo: Pick<CommentModel, 'content' | 'responseToId' | 'depth'>,
        qr: QueryRunner,
    ) {
        try {
            // depth의 값에 따라서 댓글 관계가 확인 0이면 댓글, depth가 1이상이면 대댓글
            const replyComment: CommentModel = await this.commentService.createReplyComment(
                author,
                postId,
                commentInfo,
                qr,
            );
            replyComment.depth++; // depth 값을 1 올려서 저장

            const newReplyComment = await this.commentService.save(replyComment, qr);
            this.commentService.appendReplyCommentId(
                newReplyComment.id,
                newReplyComment.responseToId,
            );

            await this.postUseCase.incrementCommentCount(postId, qr);

            return newReplyComment;
        } catch (e) {
            throw new InternalServerErrorException(`commentService error \n${e}`);
        }
    }
    async update(commentId: number, updateData: UpdateCommentDto, qr: QueryRunner) {
        const { content } = updateData;
        const comment: CommentModel = await this.commentService.loadById(commentId);
        if (!comment) {
            throw new NotFoundException(
                `UseCase.update 실행x , commentId:${commentId}를 찾을 수 없음`,
            );
        }

        if (content) comment.content = content;

        return await this.commentService.save(comment, qr);
    }

    async delete(commentId: number, qr: QueryRunner) {
        const comment: CommentModel = await this.commentService.loadById(commentId);

        // TODO Post 전용 Exception 구현
        if (!comment) {
            throw new NotFoundException(
                `UseCase.delete 실행x , commentId:${commentId}를 찾을 수 없음`,
            );
        }

        //TODO 삭제할 댓글에 대댓글이 있다면 어떻게 할 것인가?
        if (comment.replyCommentIds.length > 0) {
            return false;
        }
        return await this.commentService.delete(comment.id, qr);
    }

    getById(commentId: number) {
        return this.commentService.findById(commentId);
    }

    isCommentOwner(userId: number, commentId: number) {
        return this.commentService.isCommentOwner(userId, commentId);
    }
}
