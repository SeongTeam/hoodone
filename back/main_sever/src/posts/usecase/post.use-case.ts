import { Injectable } from '@nestjs/common/decorators';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { PostModel } from '../entities/post.entity';
import { UpdatePostDto } from '../dto/update-post.dto';
import { BadRequestException, Logger, HttpException, NotFoundException } from '@nestjs/common';

import { QuestPostModel } from '../entities/quest_post.entity';
import { SbPostModel } from '../entities/sb_post.entity';
import { PostId as PostId } from '../pips/post-id.pip';
import { QuestPostsService } from '../-quest/quest_post.service';
import { SbPostsService } from '../-sb-post/sb_post.service';
import { DtoUtils } from 'src/_common/dto/dtoUtils';
import { FavoriteService } from 'src/favorite/favorite.service';
import { PostType } from '../-comment/enum/post_type';
import { DeleteResult } from 'typeorm';

@Injectable()
export class PostsUseCases {
    constructor(
        private readonly questService: QuestPostsService,
        private readonly sbService: SbPostsService,
        private readonly favoriteService: FavoriteService,
    ) {}

    async createQuest(
        authorId: number,
        postInfo: Pick<PostModel, 'title' | 'content' | 'cloudinaryPublicId' | 'tags'>,
        qr: QueryRunner,
    ) {
        // TODO 게시물 에러코드 생성하기
        try {
            const createdPost: QuestPostModel = await this.questService.create(authorId, postInfo);
            const newPost: QuestPostModel = await this.questService.save(createdPost, qr);
            return newPost;
        } catch (e) {
            throw new NotFoundException('QuestPost create 에러');
        }
    }

    async createSb(
        authorId: number,
        questId: number,
        postInfo: Pick<SbPostModel, 'title' | 'content' | 'cloudinaryPublicId'>,
        qr: QueryRunner,
    ) {
        // TODO 게시물 에러코드 생성하기
        try {
            const createdPost: SbPostModel = await this.sbService.create(
                authorId,
                questId,
                postInfo,
            );
            const newPost: SbPostModel = await this.sbService.save(createdPost, qr);
            return newPost;
        } catch (e) {
            throw new NotFoundException('sbPost create 에러');
        }
    }

    getAllQuests() {
        return this.questService.findAll();
    }

    getAllSbs() {
        return this.sbService.findAll();
    }

    /** email을 통해서 모든 포스트를 반환합니다.
     *
     * 복수형임을 알려주기 위해서 Posts를 함수 이름에 사용했습니다
     */
    getQuestsByEmail(userEmail: string) {
        return this.questService.getPublishedPostsByUserEmail(userEmail);
    }

    getSbsByEmail(userEmail: string) {
        return this.sbService.getPublishedPostsByUserEmail(userEmail);
    }

    getQuestById(postId: number) {
        return this.questService.findById(postId);
    }

    getSbById(postId: number) {
        return this.sbService.findById(postId);
    }

    //TODO update할때 title과 content의 문자열 상태에 따른 case 나누기
    // ex title = "    " => 공백으로 이뤄져 있을 경우 어떻게 할 것인가?
    async updateQuest(postId: number, updateData: UpdatePostDto) {
        const post: QuestPostModel = await this.questService.loadById(postId);
        if (!post) {
            console.log(`UseCase.update 실행x , postId:${postId}를 찾을 수 없음`);
            throw new NotFoundException(`UseCase.update 실행x , postId:${postId}를 찾을 수 없음`);
        }

        DtoUtils.getExistPropertyNames(updateData).forEach((key) => {
            post[key] = updateData[key] as any;
        });

        return await this.questService.save(post, null);
    }

    async updateSb(postId: number, updateData: UpdatePostDto) {
        const post: SbPostModel = await this.sbService.loadById(postId);
        if (!post) {
            console.log(`UseCase.update 실행x , postId:${postId}를 찾을 수 없음`);
            throw new NotFoundException(`UseCase.update 실행x , postId:${postId}를 찾을 수 없음`);
        }

        DtoUtils.getExistPropertyNames(updateData).forEach((key) => {
            post[key] = updateData[key] as any;
        });

        return await this.sbService.save(post, null);
    }

    async increaseQuestFavorite(userId: number, questId: number, qr: QueryRunner) {
        const isExist = await this.favoriteService.confirmQuestFavorite(userId, questId, qr);
        if (isExist === false) {
            const increaseFavorite = await this.favoriteService.addQuestFavorite(
                userId,
                questId,
                qr,
            );
            const _ = await this.questService.incrementFavoriteCount(questId, qr);

            const isFavorite = await this.favoriteService.validateQuestModel(increaseFavorite);
            if (isFavorite) {
                await qr.commitTransaction();
                await qr.startTransaction();

                return await this.favoriteService.getAllFavoritesByUserId(userId);
            } else {
                return 'DB에 저장은 성공 하지만, return User.FavoriteQuest 실패';
            }
        }
        throw new BadRequestException('이미 좋아요 한 post 입니다');
    }

    async decreaseQuestFavorite(userId: number, questId: number, qr: QueryRunner) {
        const isExist = await this.favoriteService.confirmQuestFavorite(userId, questId, qr);
        if (isExist === true) {
            const decreaseFavorite = await this.favoriteService.minusQuestFavorite(
                userId,
                questId,
                qr,
            );
            const _ = await this.questService.decrementFavoriteCount(questId, qr);

            if (decreaseFavorite instanceof DeleteResult) {
                await qr.commitTransaction();
                await qr.startTransaction();

                return await this.favoriteService.getAllFavoritesByUserId(userId);
            } else {
                return 'DB에 저장은 성공 하지만, return User.FavoriteQuest 실패';
            }
        }

        throw new BadRequestException('좋아요를 누른 적이 없는 post 입니다');
    }

    async increaseSbFavorite(userId: number, sbId: number, qr: QueryRunner) {
        const isExist = await this.favoriteService.confirmQuestFavorite(userId, sbId, qr);
        if (isExist === false) {
            const result = await this.favoriteService.addSbFavorite(userId, sbId, qr);
            const _ = await this.sbService.incrementFavoriteCount(sbId, qr);
            return result;
        } else {
            throw new BadRequestException('이미 좋아요 한 post 입니다');
        }
    }

    async decreaseSbFavorite(userId: number, sbId: number, qr: QueryRunner) {
        const isExist = await this.favoriteService.confirmQuestFavorite(userId, sbId, qr);
        if (isExist === true) {
            const result = await this.favoriteService.minusSbFavorite(userId, sbId, qr);
            const _ = await this.sbService.decrementFavoriteCount(sbId, qr);
            return result;
        }

        return isExist;
    }

    async appendApproval(userId: number, postId: number, qr: QueryRunner) {
        const isApprovalVoted = await this.sbService.hasApprovalVoted(userId, postId);
        const isDisapprovalVoted = await this.sbService.hasDisapprovalVoted(userId, postId);

        if (isApprovalVoted || isDisapprovalVoted) {
            return 'appendApproval() =>Users who have already voted';
        }
        return this.sbService.appendApproval(userId, postId, qr);
    }

    async appendDisapproval(userId: number, postId: number, qr: QueryRunner) {
        const isApprovalVoted = await this.sbService.hasApprovalVoted(userId, postId);
        const isDisapprovalVoted = await this.sbService.hasDisapprovalVoted(userId, postId);

        if (isApprovalVoted || isDisapprovalVoted) {
            return 'appendDisapproval() => Users who have already voted';
        }
        return this.sbService.appendDisapproval(userId, postId, qr);
    }

    async deleteQuest(postId: number, qr: QueryRunner): Promise<boolean> {
        const post: QuestPostModel = await this.questService.loadById(postId);

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

        return await this.questService.delete(post.id, qr);
    }

    async deleteSb(postId: number, qr: QueryRunner): Promise<boolean> {
        const post: SbPostModel = await this.sbService.loadById(postId);

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

        return await this.sbService.delete(post.id, qr);
    }

    async isPostOwner(userId: number, postId: PostId) {
        const { id, postType } = postId;
        if (postType === PostType.QUEST) {
            return this.questService.isPostOwner(userId, id);
        } else {
            return this.sbService.isPostOwner(userId, id);
        }
    }

    incrementCommentCount(postId: PostId, qr: QueryRunner) {
        const { id, postType } = postId;
        if (postType === PostType.QUEST) {
            this.questService.incrementCommentCount(id, qr);
        } else {
            this.sbService.incrementCommentCount(id, qr);
        }
    }
    decrementCommentCount(postId: PostId, qr: QueryRunner) {
        const { id, postType } = postId;
        if (postType === PostType.QUEST) {
            this.questService.decrementCommentCount(id, qr);
        } else {
            this.sbService.decrementCommentCount(id, qr);
        }
    }

    // TODO PaginatedPost 사용 논의
    getPaginatedQuests(offset: number, limit: number) {
        return this.questService.getPaginatedPosts(offset, limit);
    }

    getQuestFromBoard(boardId: number, offset: number, limit: number) {
        return this.questService.getPostFromBoard(boardId, offset, limit);
    }

    // TODO PaginatedPost 사용 논의
    getPaginatedSbs(offset: number, limit: number) {
        return this.sbService.getPaginatedPosts(offset, limit);
    }

    getSbFromBoard(boardId: number, offset: number, limit: number) {
        return this.sbService.getPostFromBoard(boardId, offset, limit);
    }
}
