import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

import { QUEST_POST_FIND_OPTION, SB_POST_FIND_OPTION } from '../const/post-find-options.const';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostModel } from '../entities/post.entity';
import { SbPostModel } from '../entities/sb_post.entity';
import { postCreateOption } from '../const/post-create-options.const';

const APPROVAL_PASS_COUNT = 5;
@Injectable()
export class SbPostsService {
    constructor(
        @InjectRepository(SbPostModel)
        private readonly postsRepository: Repository<SbPostModel>,
    ) {}

    async findAll(): Promise<SbPostModel[]> {
        return this.postsRepository.find({
            ...SB_POST_FIND_OPTION,
        });
    }
    /**TODO 삭제한 게시물 비공개 게시물을 볼 수 있는 기능 추가 */
    getPublishedPostsByUserEmail(userEmail: string): Promise<SbPostModel[]> {
        return this.postsRepository.find({
            ...SB_POST_FIND_OPTION,
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
    async findById(id: number): Promise<SbPostModel> {
        const post: SbPostModel = await this.postsRepository.findOne({
            ...SB_POST_FIND_OPTION,
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
        questId: number,
        contentInfo: Pick<SbPostModel, 'title' | 'content' | 'cloudinaryPublicId'>,
        qr?: QueryRunner,
    ) {
        console.log(`questId : ${questId}`);
        try {
            const _repository = this._getRepository(qr);

            // 1) create -> 저장할 객체를 생성한다.
            const createdPost: SbPostModel = _repository.create({
                author: {
                    id: authorId,
                },
                parentPost: { id: questId },
                ...contentInfo,
                ...postCreateOption,
            });
            return createdPost;
        } catch (e) {
            console.log('create post error');
            console.log(e);
        }
    }

    async save(post: SbPostModel, qr: QueryRunner) {
        try {
            const repository = this._getRepository(qr);
            // 2) save -> 객체를 저장한다. (create 메서드에서 생성한 객체로)
            const newPost = await repository.save(post);

            return newPost;
        } catch (e) {
            console.log(e);
            console.log('post save');
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

    async incrementFavoriteCount(postId: number, qr: QueryRunner) {
        const repository = this._getRepository(qr);

        await repository.increment(
            {
                id: postId,
            },
            'favoriteCount',
            1,
        );
    }

    async decrementFavoriteCount(postId: number, qr: QueryRunner) {
        const repository = this._getRepository(qr);

        await repository.decrement(
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
        return qr ? qr.manager.getRepository<SbPostModel>(SbPostModel) : this.postsRepository;
    }

    async getPaginatedPosts(offset: number, limit: number) {
        const data = this.postsRepository.find({
            ...SB_POST_FIND_OPTION,
            where: {
                isPublished: true,
            },
            skip: limit * (offset - 1),
            take: limit,
            order: {
                createdAt: 'DESC',
            },
        });

        console.log(data);
        return data;
    }

    async getRelatedSBsByQuestId(questId: number, offset: number, limit: number) {
        const data = await this.postsRepository.find({
            ...SB_POST_FIND_OPTION,
            where: {
                isPublished: true,
                parentPost: { id: questId },
            },
            skip: limit * (offset - 1),
            take: limit,
            order: {
                createdAt: 'DESC',
            },
        });
        Logger.log('[getRelatedSBsByQuestId]', JSON.stringify(data));

        return data;
    }

    async getPostFromBoard(boardId: number, offset: number, limit: number) {
        const posts = this.postsRepository.find({
            ...SB_POST_FIND_OPTION,
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

    async appendApproval(userId: number, postId: number, qr: QueryRunner) {
        const approvalUserIds = (await this.loadById(postId)).approvalUserIds;

        approvalUserIds.push(userId);

        const result = await this.postsRepository.update(postId, {
            approvalUserIds,
        });

        return result;
    }

    async appendDisapproval(userId: number, postId: number, qr: QueryRunner) {
        const disapprovalUserIds = (await this.loadById(postId)).disapprovalUserIds;

        disapprovalUserIds.push(userId);
        const result = await this.postsRepository.update(postId, {
            disapprovalUserIds,
        });

        return result;
    }

    async hasApprovalVoted(userId: number, postId: number) {
        const post = await this.loadById(postId);

        const approvalUserIds = post.approvalUserIds;

        if (approvalUserIds.length < 1) return false;

        const approvalResult = approvalUserIds.find((_userId: number) => {
            return _userId == userId;
        });
        if (approvalResult) {
            console.log(approvalResult);
            console.log('isAlready vote user');

            return true;
        }

        return false;
    }

    async hasDisapprovalVoted(userId: number, postId: number) {
        const post = await this.loadById(postId);

        const disapprovalUserIds = post.disapprovalUserIds;

        if (disapprovalUserIds.length < 1) return false;

        const disapprovalResult = disapprovalUserIds.find((_userId: number) => {
            return _userId == userId;
        });
        if (disapprovalResult) {
            console.log(disapprovalResult);
            console.log('isAlready vote user');

            return true;
        }

        return false;
    }
}
