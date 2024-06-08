import { Injectable } from '@nestjs/common/decorators';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

import { PostModel } from '../entities/post.entity';
import { PostsService } from '../post.service';
import { UpdatePostDto } from '../dto/update-post.dto';
import { HttpException, NotFoundException } from '@nestjs/common';

@Injectable()
export class PostsUseCases {
    constructor(private readonly postService: PostsService) {}

    async create(
        authorId: number,
        postInfo: Pick<PostModel, 'title' | 'content'>,
        qr: QueryRunner,
    ) {
        // TODO 게시물 에러코드 생성하기
        try {
            const createdPost: PostModel = await this.postService.create(authorId, postInfo);
            const newPost: PostModel = await this.postService.save(createdPost, qr);
            return newPost;
        } catch (e) {
            throw new NotFoundException('post create 에러');
        }
    }

    getAll() {
        return this.postService.findAll();
    }

    /** email을 통해서 모든 포스트를 반환합니다.
     *
     * 복수형임을 알려주기 위해서 Posts를 함수 이름에 사용했습니다
     */
    getPostsByEmail(userEmail: string) {
        return this.postService.getPublishedPostsByUserEmail(userEmail);
    }

    getById(postId: number) {
        return this.postService.findById(postId);
    }

    //TODO update할때 title과 content의 문자열 상태에 따른 case 나누기
    // ex title = "    " => 공백으로 이뤄져 있을 경우 어떻게 할 것인가?
    async update(postId: number, updateData: UpdatePostDto) {
        const { title, content } = updateData;
        const post: PostModel = await this.postService.loadById(postId);
        if (!post) {
            console.log(`UseCase.update 실행x , postId:${postId}를 찾을 수 없음`);
            throw new NotFoundException(`UseCase.update 실행x , postId:${postId}를 찾을 수 없음`);
        }

        if (title) post.title = title;

        if (content) post.content = content;

        return await this.postService.save(post, null);
    }

    async delete(postId: number, qr: QueryRunner): Promise<boolean> {
        const post: PostModel = await this.postService.loadById(postId);

        // TODO Post 전용 Exception 구현
        if (!post) {
            console.log(`PostUseCase.delete 실행x , postId:${postId}를 찾을 수 없음`);
            throw new NotFoundException(
                `PostUseCase.delete 실행x , postId:${postId}를 찾을 수 없음`,
            );
        }

        //TODO 삭제할 게시물에 댓글이 있다면 어떻게 할 것인가?
        if (post.commentCount > 0) {
            return false;
        }

        return await this.postService.delete(post.id, qr);
    }

    async isPostOwner(userId: number, postId: number) {
        return this.postService.isPostOwner(userId, postId);
    }

    incrementCommentCount(postId: number, qr: QueryRunner) {
        this.postService.incrementCommentCount(postId, qr);
    }
    decrementCommentCount(postId: number, qr: QueryRunner) {
        this.postService.decrementCommentCount(postId, qr);
    }

    getPaginatedPosts(offset: number, limit: number) {
        return this.postService.getPaginatedPosts(offset, limit);
    }

    getPostFromBoard(boardId: number, offset: number, limit: number) {
        return this.postService.getPostFromBoard(boardId, offset, limit);
    }
}
