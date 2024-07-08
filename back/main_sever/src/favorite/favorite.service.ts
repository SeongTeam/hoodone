import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { QueryRunner, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { QuestFavoriteModel } from './entities/quest_favorite.entity';
import { SbFavoriteModel } from './entities/sb_favorite.entity';

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

        const result = repository.save({
            favoriteUsers: { id: userId },
            favoriteQuests: { id: questId },
        });

        return result;
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

    async addSbFavorite(userId: number, sbId: number, qr: QueryRunner) {
        const repository = this._getSbFavoriteRepository(qr);

        const result = await repository.save({
            favoriteUsers: { id: userId },
            favoriteQuests: { id: sbId },
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

        if (existing) {
            throw new BadRequestException('이미 좋아요 한 post 입니다');
        }

        return false;
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
