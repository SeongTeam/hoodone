import { Injectable } from '@nestjs/common/decorators';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

import { PostModel } from '../entities/post.entity';
import { PostsService } from '../post.service';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostsUseCases {
    constructor(private readonly postService: PostsService) {}

    async create(
        authorId: number,
        postInfo: Pick<PostModel, 'title' | 'content'>,
        qr: QueryRunner,
    ) {
        const createdPost: PostModel = await this.postService.create(authorId, postInfo);
        const newPost: PostModel = await this.postService.save(createdPost, qr);

        return newPost;
    }

    async update(postId: number, updateData: UpdatePostDto) {
        const { title, content } = updateData;
        const post: PostModel = await this.postService.loadById(postId);

        if (title) post.title = title;

        if (content) post.content = content;

        return await this.postService.save(post, null);
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

    delete(postId: number) {
        const post = this.postService.findById(postId);
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
}
