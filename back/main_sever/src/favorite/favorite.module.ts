import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { QuestFavoriteModel } from './entities/quest_favorite.entity';
import { FavoriteService } from './favorite.service';
import { SbFavoriteModel } from './entities/sb_favorite.entity';

@Module({
    imports: [TypeOrmModule.forFeature([QuestFavoriteModel, SbFavoriteModel])],
    controllers: [],
    exports: [FavoriteService],
    providers: [FavoriteService, FavoriteService],
})
export class FavoriteModule {}
