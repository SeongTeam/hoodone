import { ParseIntPipe } from '@nestjs/common/pipes';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common/decorators/core';
import { Body, Get, Param, Post } from '@nestjs/common/decorators/http';
import { QueryRunner as QR } from 'typeorm';

import { TransactionInterceptor } from 'src/common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/common/decorator/query-runner.decorator';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { User } from 'src/users/decorator/user.decorator';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('/all')
  async getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get('/userPosts')
  @UseGuards(AccessTokenGuard)
  async getPostsByUser(
    @User('email') userEmail: string, //닉네임을 수정하는 기능이 추가하면 사용할 수 없기에 불변값
  ) {
    console.log('getUserAllPosts() =>>>');
    return this.postsService.getPublishedPostsByUserEmail(userEmail);
  }
  // 2) GET /posts/:id
  //    id에 해당되는 post를 가져온다
  //    예를 들어서 id=1일경우 id가 1인 포스트를 가져온다.
  @Get(':id')
  @IsPublic()
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getPostById(id);
  }
  /**  게시물 작성 post
   * 1. 요청을 받으면 바디에 이미지가 있는지 확인 => 문제가 없다면 post 작성 허용
   * 2. 이미지가 있다면 Google OCR에 API 요청을 보내고 대기
   * 3. google OCR의 resp에 정보를 hoodone의 gpt로 요청을 보낸다.
   * 4. 응답받은 텍스트를 새로 생성된 post의 댓글로 추가해준다.
   */
  @Post('/post')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  async postNewPosts(
    @User('id') userId: number,
    @Body() body: CreatePostDto,
    @QueryRunner() qr: QR,
  ) {
    // 로직 실행
    const post = await this.postsService.createPost(userId, body, qr);

    return this.postsService.getPostById(post.id, qr);
  }
}
