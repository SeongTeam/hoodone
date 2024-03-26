import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostModel } from './entities/post.entity';
import { DEFAULT_POST_FIND_OPTIONS } from './const/default-post-find-options.const';
@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostModel)
    private readonly postsRepository: Repository<PostModel>,
  ) {}

  async findAllPosts() {
    return this.postsRepository.find({
      ...DEFAULT_POST_FIND_OPTIONS,
    });
  }
  async findPublishedPostsByUserEmail(userEmail: string) {
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

  async findPostById(id: number, qr?: QueryRunner) {
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
    const createdPost: PostModel = this.postsRepository.create({
      author: {
        id: authorId,
      },
      ...postDto,
      likeCount: 0,
      commentCount: 0,
      isPublished: true,
    });

    return createdPost;
  }
  
  async savePost(post: PostModel, qr?: QueryRunner) {
    const repository = this.getRepository(qr);
    // 2) save -> 객체를 저장한다. (create 메서드에서 생성한 객체로)
    const newPost = await repository.save(post);

    return newPost;
  }

  async loadPostById(postId: number) {
    const post = this.postsRepository.preload({
      id: postId,
    });
    if (!post) {
      throw new NotFoundException(`${postId}id인 게시물을 찾지 못했습니다`);
    }
    return post;
  }

  async incrementCommentCount(postId: number, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    await repository.increment(
      {
        id: postId,
      },
      'commentCount',
      1,
    );
  }

  async decrementCommentCount(postId: number, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    await repository.decrement(
      {
        id: postId,
      },
      'commentCount',
      1,
    );
  }
  async checkPostExistsById(id: number) {
    return this.postsRepository.exist({
      where: {
        id,
      },
    });
  }

  getRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository<PostModel>(PostModel) : this.postsRepository;
  }
}
