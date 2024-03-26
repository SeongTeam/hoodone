import { Inject, Injectable } from '@nestjs/common/decorators';
import { BadRequestException, forwardRef } from '@nestjs/common';
import { UserModel } from 'src/users/entities/user.entity';
import { QueryRunner } from 'typeorm';

import { CommentsService } from '../comment.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { CreateResponseCommentDto } from '../dto/create-response-comment.dto';

@Injectable()
export class CommentUseCases {
  constructor(
    @Inject(forwardRef(() => CommentsService))
    private readonly dataServices: CommentsService,
  ) {}

  async createComment(
    author: UserModel,
    postId: number,
    createCommentDto: CreateCommentDto,
    qr?: QueryRunner,
  ) {
    try {
      const CommentRepository = this.dataServices.getCommentRepository(qr);
      const comment = CommentRepository.create({
        post: {
          id: postId,
        },
        index: 0, // todo post의 댓글 리스트 갯수 만큼 index를 증가시켜야 한다.
        depth: 0,
        author,
        ...createCommentDto,
      });

      const newComment = await CommentRepository.save(comment);

      return newComment;
    } catch (e) {
      throw `commentService error \n${e}`;
    }
  }

  async createResponseComment(
    author: UserModel,
    postId: number, // todo 가능하면 createDto안에 집어 넣자
    createDto: CreateResponseCommentDto,
    qr?: QueryRunner,
  ) {
    let _responseCommentIDs: number[] ;
    try {
      const ResponseCommentRepository = this.dataServices.getResponseCommentRepository(qr);
    
      // depth의 값에 따라서 댓글 관계가 확인 0이면 댓글 1이상이면 대댓글
      if (createDto.depth === 0){
        const comment = await this.dataServices.loadCommentById(createDto.responseToId);
        _responseCommentIDs = comment.responseCommentIDs;
      }else 
        {const responseComment = await this.dataServices.loadRespondCommentById(createDto.responseToId);
          _responseCommentIDs = responseComment.responseCommentIDs;
        }
           const responseComment =  ResponseCommentRepository.create({
        post: {
          id: postId,
        },
        responseToId: createDto.responseToId,
        index: ( _responseCommentIDs.length),
        author,
        ...createDto,
      });
      responseComment.depth++; // 위에서는 depth 값을 1 올려주지 않아서

      const newResponseComment = await ResponseCommentRepository.save(responseComment);
      this.dataServices.appendResponseCommentId(createDto.depth, newResponseComment.id ,createDto.responseToId)

      return newResponseComment;
    } catch (e) {
      throw `commentService error \n${e}`;
    }
  }

  getCommentById(commentId: number){
      return this.dataServices.findCommentById(commentId)
  }
  getResponseCommentById(commentId: number){
    return this.dataServices.findResponseCommentById(commentId)
}
  // controller에서 사용하기 위해서 사용 
  // 다른 usecase 함수 에서도 사용하자 
  // async loadCommentById(commentId: number) {
  //   if (commentId <= 10000000){

  //     return await this.dataServices.loadCommentById(commentId);
  //   }
  //   return await this.dataServices.loadRespondCommentById(commentId);
  // }

  // async loadResponseCommentById(commentId: number) {
  //   return await this.dataServices.loadRespondCommentById(commentId);
  // }
}
