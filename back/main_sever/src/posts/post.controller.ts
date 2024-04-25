import { PostApiResponseDto } from 'hoodone-shared';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common/decorators/core';
import { Body, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common/decorators/http';
import { QueryRunner as QR } from 'typeorm';

import { AccessTokenGuard } from 'src/auth/guard/token/access-token.guard';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { User } from 'src/users/decorator/user.decorator';

import { CreatePostDto } from './dto/create-post.dto';
import { PostsUseCases } from './usecase/post.use-case';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { PostOwnerGuard } from './guard/post-owner.guard';
import { UpdatePostDto } from './dto/update-post.dto';
import { Roles } from 'src/users/decorator/roles.decorator';
import { RoleType } from 'src/users/const/role.type';
import { RoleGuard } from './guard/role.guard';

@Controller('posts')
export class PostsController {
    constructor(private readonly postUseCase: PostsUseCases) {}

    /**  게시물 작성 post
     * 1. 요청을 받으면 바디에 이미지가 있는지 확인 => 문제가 없다면 post 작성 허용
     * 2. 이미지가 있다면 Google OCR에 API 요청을 보내고 대기
     * 3. google OCR의 resp에 정보를 hoodone의 gpt로 요청을 보낸다.
     * 4. 응답받은 텍스트를 새로 생성된 post의 댓글로 추가해준다.
     */
    @Post()
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(TransactionInterceptor)
    async post(@User('id') userId: number, @Body() body: CreatePostDto, @QueryRunner() qr: QR) {
        // 로직 실행
        const newPost = await this.postUseCase.create(userId, body, qr);

        return newPost;
    }

    // 2) GET /posts/all
    //     생성된 모든 post를 가져온다.
    //TODO 가져오는 포스트를 정렬하는 기능을 추가 [최신, 인기, 조회수 등등]
    @Get('/all')
    async getAllPosts() {
        return this.postUseCase.getAll();
    }
    // TODO 복수와 단수를 반환하는 API를 만들고
    // 복수를 반환할때 Query string을 사용하는 로직 추가
    @Get()
    async getPostsByEmail(@Query('email') userEmail: string) {
        let res = new PostApiResponseDto();
        res.getAll = await this.postUseCase.getPostsByEmail(userEmail);

        return res;
    }

    // 3) GET /posts/:id
    //    id에 해당되는 post를 가져온다
    //    예를 들어서 id=1일경우 id가 1인 포스트를 가져온다.
    @Get(':id')
    @IsPublic()
    async getById(@Param('id', ParseIntPipe) id: number) {
        let res = new PostApiResponseDto();
        res.getById = await this.postUseCase.getById(id);

        return res;
    }
    // 4) PATCH /posts/:id
    //    id에 해당되는 POST를 변경한다.
    @Patch(':id')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @UseGuards(AccessTokenGuard, PostOwnerGuard, RoleGuard)
    async patchPost(@Param('id', ParseIntPipe) id: number, @Body() body: UpdatePostDto) {
        return this.postUseCase.update(id, body);
    }

    // 5) DELETE /posts/:id
    //    id에 해당되는 POST를 삭제한다.
    @Delete(':id')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @UseGuards(AccessTokenGuard, PostOwnerGuard, RoleGuard)
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.postUseCase.delete(id);
    }
}
