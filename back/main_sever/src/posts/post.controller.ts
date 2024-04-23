import { PostApiResponseDto } from 'hoodone-shared';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common/decorators/core';
import { Body, Get, Param, Post, Query } from '@nestjs/common/decorators/http';
import { QueryRunner as QR } from 'typeorm';

import { AccessTokenGuard } from 'src/auth/guard/token/access-token.guard';
import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { User } from 'src/users/decorator/user.decorator';

import { CreatePostDto } from './dto/create-post.dto';
import { PostsUseCases } from './usecase/post.use-case';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

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

    @Get('/all')
    async getAllPosts() {
        return this.postUseCase.getAll();
    }
    // TODO 복수와 단수를 반환하는 API를 만들고
    // 복수를 반환할때 Query string을 사용하는 로직 추가
    // @Get()
    // async getPostsByQuery(@Query('email') userEmail: string) {
    //     console.log('getUserAllPosts() =>>>');
    //     return this.postUseCase.getPostsByEmail(userEmail);
    // }

    @Get()
    async getPostsByEmail(@Query('email') userEmail: string) {
        let res = new PostApiResponseDto();
        res.getAll = await this.postUseCase.getPostsByEmail(userEmail);

        return res;
    }
    // @Get('/email')
    // async getPostsByUser(
    //     @User('email') userEmail: string, //닉네임을 수정하는 기능이 추가하면 사용할 수 없기에 불변값
    // ) {
    //     console.log('getUserAllPosts() =>>>');
    //     return this.postUseCase.getPostsByEmail(userEmail);
    // }
    // 2) GET /posts/:id
    //    id에 해당되는 post를 가져온다
    //    예를 들어서 id=1일경우 id가 1인 포스트를 가져온다.
    @Get(':id')
    @IsPublic()
    async getById(@Param('id', ParseIntPipe) id: number) {
        let res = new PostApiResponseDto();
        res.getById = await this.postUseCase.getById(id);

        return res;
    }
}
