import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BaseModel } from 'src/_common/entity/base.entity';
import { ConfigModule } from '@nestjs/config';
import {
    ENV_DB_DATABASE_KEY,
    ENV_DB_HOST_KEY,
    ENV_DB_PASSWORD_KEY,
    ENV_DB_PORT_KEY,
    ENV_DB_USER_NAME_KEY,
} from 'src/_common/const/env-keys.const';

@Injectable()
export class TypeormConfig implements TypeOrmOptionsFactory {
    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'postgres', // 데이터베이스 종류
            url: '', // TODO: ex) postgresql://username:password@hostname:port/database
            host: process.env[ENV_DB_HOST_KEY],
            port: +process.env[ENV_DB_PORT_KEY], // 데이터베이스 포트
            username: process.env[ENV_DB_USER_NAME_KEY],
            password: process.env[ENV_DB_PASSWORD_KEY],
            database: process.env[ENV_DB_DATABASE_KEY], // 연결할 데이터베이스 이름
            autoLoadEntities: true,
            synchronize: true, // 스키마 자동 동기화 (production에서는 false)
            // dropSchema: true, // 애플리케이션 실행시 기존 스키마 삭제 여부
            keepConnectionAlive: true, // 애플리케이션 재시작 시 연결 유지
            // logging: true, // TODO: 데이터베이스 쿼리 로깅 여부
            entities: [BaseModel, __dirname + 'src/**/entity/*.entity.{ts,js}'], //엔티티 클래스 경로
            extra: {
                max: 100,
            },
        } as TypeOrmModuleOptions;
    }
}
