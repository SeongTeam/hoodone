import { Inject, Injectable } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostModel } from '../entities/post.entity';
import { PostsService } from '../post.service';

@Injectable()
export class PostsUseCases {
  constructor(private readonly postService: PostsService) {}

  async createNewPost(authorId: number, creatDto: CreatePostDto, qr: QueryRunner) {
    const createdPost: PostModel = await this.postService.createPost(authorId, creatDto);
    const newPost: PostModel = await this.postService.savePost(createdPost, qr);

    return newPost;
  }

  async updatePost(postId: number, updateDto: UpdatePostDto) {
    const { title, content } = updateDto;
    const post: PostModel = await this.postService.loadPostById(postId);

    if (title) post.title = title;

    if (content) post.content = content;

    return await this.postService.savePost(post, null);
  }

  async getAllPosts() {
    return await this.postService.findAllPosts();
  }

  async getPostsByEmail(userEmail: string) {
    return await this.postService.findPublishedPostsByUserEmail(userEmail);
  }

  async getPostById(postId: number) {
    return await this.postService.findPostById(postId);
  }

  async incrementCommentCount(postId: number, qr?: QueryRunner) {
    this.postService.incrementCommentCount(postId, qr);
  }
  async decrementCommentCount(postId: number, qr?: QueryRunner) {
    this.postService.decrementCommentCount(postId, qr);
  }
}
