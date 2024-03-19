import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsModel } from './entities/posts.entity';
import { DEFAULT_POST_FIND_OPTIONS } from './const/default-post-find-options.const';
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {}

  async getAllPosts() {
    return this.postsRepository.find({
      ...DEFAULT_POST_FIND_OPTIONS,
    });
  }
  async getPublishedPostsByUserEmail(userEmail: string) {
    return this.postsRepository.find({
      ...DEFAULT_POST_FIND_OPTIONS,
      where: {
        author: {
          email: userEmail, //  nickname은 변경이 가능 email은 불변값
        },
        isPublished: true,
      },
    });
  }

  async getPostById(id: number, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    const post = await repository.findOne({
      ...DEFAULT_POST_FIND_OPTIONS,
      where: {
        id,
        isPublished: true,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async createPost(authorId: number, postDto: CreatePostDto, qr?: QueryRunner) {
    // 1) create -> 저장할 객체를 생성한다.
    // 2) save -> 객체를 저장한다. (create 메서드에서 생성한 객체로)
    const repository = this.getRepository(qr);

    const post = repository.create({
      author: {
        id: authorId,
      },
      ...postDto,
      likeCount: 0,
      commentCount: 0,
      isPublished: true,
    });

    const newPost = await repository.save(post);

    return newPost;
  }

  async updatePost(postId: number, postDto: UpdatePostDto) {
    const { title, content } = postDto;
    // save의 기능
    // 1) 만약에 데이터가 존재하지 않는다면 (id 기준으로) 새로 생성한다.
    // 2) 만약에 데이터가 존재한다면 (같은 id의 값이 존재한다면) 존재하던 값을 업데이트한다.

    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    if (title) {
      post.title = title;
    }

    if (content) {
      post.content = content;
    }

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  getRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository<PostsModel>(PostsModel) : this.postsRepository;
  }
}
