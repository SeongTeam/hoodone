import { PostApiResponseDto } from 'hoodone-shared';
import { ParseIntPipe, DefaultValuePipe, ValidationPipe } from '@nestjs/common/pipes';
import { Controller, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common/decorators/core';
import { Body, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common/decorators/http';
import { QueryRunner as QR } from 'typeorm';

import { AccessTokenGuard } from 'src/auth/guard/token/access-token.guard';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { User } from 'src/users/decorator/user.decorator';

import { CreatePostDto } from './dto/create-post.dto';
import { GetPaginatedPostsQueryDTO } from './dto/get-paginated-posts.dto';
import { PostsUseCases } from './usecase/post.use-case';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { PostOwnerGuard } from './guard/post-owner.guard';
import { UpdatePostDto } from './dto/update-post.dto';
import { Roles } from 'src/users/decorator/roles.decorator';
import { RoleType } from 'src/users/const/role.type';
import { RoleGuard } from '../auth/guard/role.guard';
import { Logger } from '@nestjs/common';

@Controller('posts')
export class PostsController {
    constructor(private readonly postUseCase: PostsUseCases) {}

    /*TODO
    - Image URL 저장 추가하기
    */
    @Post()
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(TransactionInterceptor)
    async post(@User('id') userId: number, @Body() body: CreatePostDto, @QueryRunner() qr: QR) {
        // 로직 실행
        const newPost = await this.postUseCase.create(userId, body, qr);

        return newPost;
    }

    /*TODO 
    - 가져오는 포스트를 정렬하는 기능을 추가 [최신, 인기, 조회수 등등]
    */
    @Get('/all')
    async getAllPosts() {
        const res = new PostApiResponseDto();
        res.getAll = await this.postUseCase.getAll();
        return res;
    }

    @Get('/paginated')
    async getPaginatedPosts(
        @Query(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
        queryParams: GetPaginatedPostsQueryDTO,
    ) {
        const { offset, limit } = queryParams;
        const res = new PostApiResponseDto();
        res.getPaginatedPosts = await this.postUseCase.getPaginatedPosts(offset, limit);

        return res;
    }

    // TODO 복수와 단수를 반환하는 API를 만들고
    // 복수를 반환할때 Query string을 사용하는 로직 추가
    @Get()
    async getPostsByEmail(@Query('email') userEmail: string) {
        let res = new PostApiResponseDto();
        res.getAll = await this.postUseCase.getPostsByEmail(userEmail);

        return res;
    }

    @Get(':id')
    @IsPublic()
    async getById(@Param('id', ParseIntPipe) id: number) {
        let res = new PostApiResponseDto();
        res.getById = await this.postUseCase.getById(id);

        return res;
    }

    @Patch(':id')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @UseGuards(AccessTokenGuard, PostOwnerGuard, RoleGuard)
    @UseInterceptors(TransactionInterceptor)
    async patchPost(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdatePostDto,
        @QueryRunner() qr: QR,
    ) {
        return this.postUseCase.update(id, body);
    }

    @Delete(':id')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @UseGuards(AccessTokenGuard, PostOwnerGuard, RoleGuard)
    @UseInterceptors(TransactionInterceptor)
    delete(@Param('id', ParseIntPipe) id: number, @QueryRunner() qr: QR) {
        return this.postUseCase.delete(id, qr);
    }
}
