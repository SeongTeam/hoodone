import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

import { COMMON_POST_FIND_OPTION } from './const/post-find-options.const';
import { PostModel } from './entities/post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
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

    /** 매계변수id와 동일한 post를 보내줍니다.
     * 만약 post가 없다면 ` NotFoundException()` 실행
     */
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
        const _repository = this._getRepository(qr);

        // 1) create -> 저장할 객체를 생성한다.
        const createdPost: PostModel = _repository.create({
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
    async updatePost(postId: number, postDto: UpdatePostDto) {
        const { title, content } = postDto;
        // save의 기능
        // 1) 만약에 데이터가 존재하지 않는다면 (id 기준으로) 새로 생성한다.
        // 2) 만약에 데이터가 존재한다면 (같은 id의 값이 존재한다면) 존재하던 값을 업데이트한다.

        const post = await this.postsRepository.findOne({
            where: {
                id: postId,
            },
        });

        if (!post) {
            throw new NotFoundException('Post id를 찾을 수 없습니다');
        }

        if (title) {
            post.title = title;
        }

        if (content) {
            post.content = content;
        }

        const updatedPost = await this.postsRepository.save(post);

        return updatedPost;
    }

    async delete(postId: number, qr: QueryRunner): Promise<boolean> {
        try {
            const repository = this._getRepository(qr);
            repository.delete(postId);

            return true;
        } catch (e) {
            return false;
        }
    }

    /** 수정 삭제 시에는 loadById()를 사용 */
    async loadById(postId: number) {
        const post = this.postsRepository.findOneBy({
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

    async isPostOwner(userId: number, postId: number) {
        return this.postsRepository.exists({
            where: {
                id: postId,
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
        return qr ? qr.manager.getRepository<PostModel>(PostModel) : this.postsRepository;
    }
}
