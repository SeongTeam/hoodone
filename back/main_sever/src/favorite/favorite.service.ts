import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { QueryRunner, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { QuestFavoriteModel } from './entities/quest_favorite.entity';
import { SbFavoriteModel } from './entities/sb_favorite.entity';
import { PostType } from 'src/posts/-comment/enum/post_type';
import { validate } from 'class-validator';

@Injectable()
export class FavoriteService {
    constructor(
        @InjectRepository(QuestFavoriteModel)
        private readonly questFavoriteRepository: Repository<QuestFavoriteModel>,

        @InjectRepository(SbFavoriteModel)
        private readonly sbFavoriteRepository: Repository<SbFavoriteModel>,
    ) {}

    async addQuestFavorite(userId: number, questId: number, qr: QueryRunner) {
        const repository = this._getQuestFavoriteRepository(qr);
        const newData = {
            favoriteUsers: { id: userId },
            favoriteQuests: { id: questId },
            postId: questId,
            postType: PostType.QUEST,
        } as QuestFavoriteModel;
        const result = await repository.save(newData);

        return result as QuestFavoriteModel;
    }

    async minusQuestFavorite(userId: number, questId: number, qr: QueryRunner) {
        const repository = this._getQuestFavoriteRepository(qr);

        const result = await repository.delete({
            favoriteUsers: {
                id: userId,
            },
            favoriteQuests: {
                id: questId,
            },
        });

        return result;
    }

    async addSbFavorite(userId: number, sbId: number, qr: QueryRunner): Promise<SbFavoriteModel> {
        const repository = this._getSbFavoriteRepository(qr);

        const result = await repository.save({
            favoriteUsers: { id: userId },
            favoriteSbs: { id: sbId },
            postId: sbId,
            postType: PostType.SB,
        });

        return result;
    }

    async minusSbFavorite(userId: number, sbId: number, qr: QueryRunner) {
        const repository = this._getSbFavoriteRepository(qr);

        const result = await repository.delete({
            favoriteUsers: {
                id: userId,
            },
            favoriteSbs: {
                id: sbId,
            },
        });

        return result;
    }

    async confirmQuestFavorite(userId: number, questId: number, qr?: QueryRunner) {
        const userFollowersRepository = this._getQuestFavoriteRepository(qr);

        const existing = await userFollowersRepository.findOne({
            where: {
                favoriteUsers: {
                    id: userId,
                },
                favoriteQuests: {
                    id: questId,
                },
            },
            relations: {
                favoriteQuests: true,
                favoriteUsers: true,
            },
        });
        Logger.debug('confirmQuestFavorite()', existing);
        if (existing) {
            return true;
        }

        return false;
    }

    async confirmSbFavorite(userId: number, sbId: number, qr?: QueryRunner) {
        const userFollowersRepository = this._getSbFavoriteRepository(qr);

        const existing = await userFollowersRepository.findOne({
            where: {
                favoriteUsers: {
                    id: userId,
                },
                favoriteSbs: {
                    id: sbId,
                },
            },
            relations: {
                favoriteSbs: true,
                favoriteUsers: true,
            },
        });

        Logger.debug('confirmSbFavorite()', existing);

        if (existing) {
            return true;
        }

        return false;
    }

    getAllFavoriteQuestsByUserId(userId: number) {
        Logger.debug('getAllFavoriteQuestsByUserId() work !!');
        return this.questFavoriteRepository.find({
            where: {
                favoriteUsers: { id: userId },
            },
        });
    }

    getAllFavoriteSbsByUserId(userId: number) {
        Logger.debug('getAllFavoriteSbsByUserId() work !!');
        return this.sbFavoriteRepository.find({
            where: {
                favoriteUsers: { id: userId },
            },
        });
    }

    async validateQuestModel(obj: any): Promise<boolean> {
        const validator = new QuestFavoriteModel();
        Object.assign(validator, obj);
        const errors = await validate(validator);

        return errors.length === 0;
    }

    async validateSbModel(obj: any): Promise<boolean> {
        const validator = new SbFavoriteModel();
        Object.assign(validator, obj);
        const errors = await validate(validator);

        return errors.length === 0;
    }

    _getQuestFavoriteRepository(qr?: QueryRunner) {
        return qr
            ? qr.manager.getRepository<QuestFavoriteModel>(QuestFavoriteModel)
            : this.questFavoriteRepository;
    }

    _getSbFavoriteRepository(qr?: QueryRunner) {
        return qr
            ? qr.manager.getRepository<SbFavoriteModel>(SbFavoriteModel)
            : this.sbFavoriteRepository;
    }
}
