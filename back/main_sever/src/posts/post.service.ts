import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

import { COMMON_POST_FIND_OPTION } from './const/post-find-options.const';
import { PostModel } from './entities/post.entity';
@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostModel)
        private readonly postsRepository: Repository<PostModel>,
    ) {}

    async findAll(): Promise<PostModel[]> {
        return this.postsRepository.find({
            ...COMMON_POST_FIND_OPTION,
        });
    }
    /**TODO 삭제한 게시물 비공개 게시물을 볼 수 있는 기능 추가 */
    getPublishedPostsByUserEmail(userEmail: string): Promise<PostModel[]> {
        return this.postsRepository.find({
            ...COMMON_POST_FIND_OPTION,
            where: {
                author: {
                    email: userEmail, //  nickname은 변경이 가능 email은 불변값
                },
                isPublished: true,
            },
        });
    }

    async findById(id: number): Promise<PostModel> {
        const post: PostModel = await this.postsRepository.findOne({
            ...COMMON_POST_FIND_OPTION,
            where: {
                id,
                isPublished: true,
            },
        });

        if (!post) {
            throw new NotFoundException();
        }

        return post;
    }

    /**Post 생성, DB에 저장하지 않습니다
     *
     * 저장을 원한다면 saveComment()를 사용하세요
     */
    async create(
        authorId: number,
        commentInfo: Pick<PostModel, 'title' | 'content'>,
        qr?: QueryRunner,
    ) {
        // 1) create -> 저장할 객체를 생성한다.
        const createdPost: PostModel = this.postsRepository.create({
            author: {
                id: authorId,
            },
            ...commentInfo,
            likeCount: 0,
            commentCount: 0,
            isPublished: true,
        });

        return createdPost;
    }

    async save(post: PostModel, qr: QueryRunner) {
        const repository = this._getRepository(qr);
        // 2) save -> 객체를 저장한다. (create 메서드에서 생성한 객체로)
        const newPost = await repository.save(post);

        return newPost;
    }

    async loadById(postId: number) {
        const post = this.postsRepository.preload({
            id: postId,
        });
        if (!post) {
            throw new NotFoundException(`${postId}id인 게시물을 찾지 못했습니다`);
        }
        return post;
    }

    async incrementCommentCount(postId: number, qr: QueryRunner) {
        const repository = this._getRepository(qr);

        await repository.increment(
            {
                id: postId,
            },
            'commentCount',
            1,
        );
    }

    async decrementCommentCount(postId: number, qr: QueryRunner) {
        const repository = this._getRepository(qr);

        await repository.decrement(
            {
                id: postId,
            },
            'commentCount',
            1,
        );
    }
    // hasExistedEmail
    async hasExistedId(id: number) {
        return this.postsRepository.exists({
            where: {
                id,
            },
        });
    }

    _getRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<PostModel>(PostModel) : this.postsRepository;
    }
}
