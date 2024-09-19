import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

import { QUEST_POST_FIND_OPTION } from '../const/post-find-options.const';
import { QuestPostModel } from '../entities/quest_post.entity';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostModel } from '../entities/post.entity';
import { postCreateOption } from '../const/post-create-options.const';
import { UserModel } from 'src/users/entities/user.entity';
import { Not } from 'typeorm';
import { ENV_ADMIN_EMAIL } from '@/_common/const/env-keys.const';
import { ServiceException } from '@/_common/exception/service-exception';
@Injectable()
export class QuestPostsService {
    constructor(
        @InjectRepository(QuestPostModel)
        private readonly postsRepository: Repository<QuestPostModel>,
    ) {}

    async findAll(): Promise<QuestPostModel[]> {
        return this.postsRepository.find({
            ...QUEST_POST_FIND_OPTION,
        });
    }
    /**TODO 삭제한 게시물 비공개 게시물을 볼 수 있는 기능 추가 */
    getPublishedPostsByUserEmail(userEmail: string): Promise<QuestPostModel[]> {
        return this.postsRepository.find({
            ...QUEST_POST_FIND_OPTION,
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
    async findById(id: number): Promise<QuestPostModel> {
        const post: QuestPostModel = await this.postsRepository.findOne({
            ...QUEST_POST_FIND_OPTION,
            where: {
                id,
                isPublished: true,
            },
        });

        if (!post) {
            throw new ServiceException('ENTITY_NOT_FOUND', 'NOT_FOUND');
        }

        return post;
    }

    /**Post 생성, DB에 저장하지 않습니다
     *
     * 저장을 원한다면 saveComment()를 사용하세요
     */
    async create(
        authorId: number,
        contentInfo: Pick<PostModel, 'title' | 'content' | 'cloudinaryPublicId'>,
        qr?: QueryRunner,
    ) {
        try {
            const _repository = this._getRepository(qr);

            // 1) create -> 저장할 객체를 생성한다.
            const createdPost: QuestPostModel = _repository.create({
                author: {
                    id: authorId,
                },
                favoriteUsers: [],
                ...contentInfo,
                ...postCreateOption,
            });
            return createdPost;
        } catch (e) {
            Logger.error('[QuestPostsService][create] error', JSON.stringify(e));
        }
    }

    async save(post: QuestPostModel, qr: QueryRunner) {
        try {
            const repository = this._getRepository(qr);
            // 2) save -> 객체를 저장한다. (create 메서드에서 생성한 객체로)
            const newPost = await repository.save(post);

            return newPost;
        } catch (e) {
            Logger.error('[QuestPostsService][save] error', JSON.stringify(e));
        }
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
            throw new ServiceException('ENTITY_UPDATE_FAILED', 'NOT_FOUND', { postId });
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

    async appendFavorite(user: UserModel, postId: number, qr: QueryRunner) {
        const repository = this._getRepository(qr);

        let post = await this.loadById(postId);

        const result = await repository.save(post);

        return result;
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

    async softRemove(postEntity: QuestPostModel, qr: QueryRunner): Promise<boolean> {
        try {
            const repository = this._getRepository(qr);
            await repository.softRemove(postEntity);
            return true;
        } catch (e) {
            Logger.error(`[softRemove] exception occurred. postId : ${postEntity}`, { e });
            return false;
        }
    }

    /** 수정 삭제 시에는 loadById()를 사용 */
    async loadById(postId: number) {
        const post = this.postsRepository.findOneBy({
            id: postId,
        });
        if (!post) {
            throw new ServiceException('ENTITY_NOT_FOUND', 'NOT_FOUND', { postId });
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

    async incrementFavoriteCount(postId: number, qr: QueryRunner) {
        const repository = this._getRepository(qr);

        return await repository.increment(
            {
                id: postId,
            },
            'favoriteCount',
            1,
        );
    }

    async decrementFavoriteCount(postId: number, qr: QueryRunner) {
        const repository = this._getRepository(qr);
        const post = await this.loadById(postId);
        if (post.favoriteCount < 1) return 'favoriteCount가 1보다 작습니다';

        return await repository.decrement(
            {
                id: postId,
            },
            'favoriteCount',
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
        return qr ? qr.manager.getRepository<QuestPostModel>(QuestPostModel) : this.postsRepository;
    }

    async getPaginatedPosts(offset: number, limit: number, isOnlyAdminPost?: boolean) {
        const adminEmail: string = process.env[ENV_ADMIN_EMAIL];
        const data = await this.postsRepository.find({
            ...QUEST_POST_FIND_OPTION,
            where: {
                isPublished: true,
                author: {
                    email: isOnlyAdminPost ? adminEmail : Not(adminEmail),
                },
            },

            skip: limit * (offset - 1),
            take: limit,
            order: {
                createdAt: 'DESC',
            },
        });

        return data;
    }

    async getPostFromBoard(boardId: number, offset: number, limit: number) {
        const posts = this.postsRepository.find({
            ...QUEST_POST_FIND_OPTION,
            where: {
                boardId: boardId,
                isPublished: true,
            },
            skip: limit * (offset - 1),
            take: limit,
            order: {
                createdAt: 'DESC',
            },
        });
        return posts;
    }
}
