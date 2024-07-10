import { Injectable } from '@nestjs/common/decorators';
import {
    InternalServerErrorException,
    NotFoundException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { UserModel } from 'src/users/entities/user.entity';
import { QueryRunner } from 'typeorm';

import { CommentsService } from '../comment.service';
import { CommentModel } from '../entities/comment.entity';
import { PostsUseCases } from 'src/posts/usecase/post.use-case';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { PostId } from 'src/posts/pips/post-id.pip';
import { PostType } from '../enum/post_type';

@Injectable()
export class CommentUseCase {
    constructor(
        private readonly commentService: CommentsService,
        private readonly postUseCase: PostsUseCases,
    ) {}

    async createComment(
        author: UserModel,
        postId: PostId,
        commentInfo: Pick<CommentModel, 'content'>,
        qr?: QueryRunner,
    ) {
        let comment: CommentModel;
        try {
            comment = await this.commentService.createComment(author, commentInfo, postId, qr);

            const newComment = this.commentService.save(comment, qr);
            await this.postUseCase.incrementCommentCount(postId, qr);

            return newComment;
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException(`CommentUseCases.createComment() error \n${e}`);
        }
    }

    async createReplyComment(
        author: UserModel,
        postId: PostId,
        commentInfo: Pick<CommentModel, 'content' | 'responseToId'>,
        qr: QueryRunner,
    ) {
        const { id, postType } = postId;
        let replyComment: CommentModel;
        try {
            // depth의 값에 따라서 댓글 관계가 확인 0이면 댓글, depth가 1이상이면 대댓글

            replyComment = await this.commentService.createReplyComment(
                author,
                commentInfo,
                postId,
                qr,
            );

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

    async softdelete(commentId: number, qr: QueryRunner) {
        const comment: CommentModel = await this.commentService.loadById(commentId);

        if (!comment) {
            throw new NotFoundException(
                `UseCase.softdelete 실행x , commentId:${commentId}를 찾을 수 없음`,
            );
        }
        comment.content = '';
        comment.isUserDelete = true;

        const deletedComment = this.commentService.save(comment, qr);

        return deletedComment;
    }

    async delete(commentId: number, qr: QueryRunner) {
        const comment: CommentModel = await this.commentService.loadById(commentId);

        // TODO Post 전용 Exception 구현
        if (!comment) {
            throw new NotFoundException(
                `UseCase.delete 실행x , commentId:${commentId}를 찾을 수 없음`,
            );
        }

        return await this.commentService.delete(comment, qr);
    }

    getById(commentId: number) {
        return this.commentService.findById(commentId);
    }

    isCommentOwner(userId: number, commentId: number) {
        return this.commentService.isCommentOwner(userId, commentId);
    }

    getCommentsByPostId(postId: PostId) {
        const comments = this.commentService.findCommentsByPostId(postId);

        return comments;
    }

    async getGroupedCommentsByPostIdWithRange(postId: PostId, depthRange: number[]) {
        const comments = await this.commentService.findCommentsByPostIdWithDepth(
            postId,
            depthRange,
        );
        const commentList = this.buildNestedComments(comments);

        return commentList;
    }

    async getReplyComments(postId: PostId, responseToId: number, limit: number) {
        const parentComment = await this.commentService.findById(responseToId);
        const range = [parentComment.depth + 1, parentComment.depth + limit];

        const comments = await this.commentService.findCommentsByPostIdWithDepth(postId, range);

        const replyComment = this.buildNestedComments(comments, responseToId);

        return replyComment;
    }

    buildNestedComments(comments: CommentModel[], parentId: number = 0) {
        const rootCooments: CommentModel[] = [];
        const commentMap: { [id: number]: CommentModel } = {};

        //mapping
        for (const comment of comments) {
            commentMap[comment.id] = comment;
            if (comment.responseToId === parentId) rootCooments.push(comment);
        }

        //build nested structure
        for (const comment of comments) {
            const parentComment = commentMap[comment.responseToId];
            if (parentComment) {
                if (!parentComment['replyComments']) parentComment['replyComments'] = [];
                parentComment['replyComments'].push(comment);
            }
        }

        return rootCooments;
    }
}
