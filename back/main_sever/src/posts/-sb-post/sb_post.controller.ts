import { PostApiResponseDto } from '@/sharedModule/response-dto/post-api-reponse.dto';
import { SbPostApiResponseDto } from '@/sharedModule/response-dto/sb-post-api-response.dto';
import { ParseIntPipe, ParseBoolPipe } from '@nestjs/common/pipes';
import { Controller, UseGuards, UseInterceptors, UsePipes } from '@nestjs/common/decorators/core';
import {
    Body,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Headers,
} from '@nestjs/common/decorators/http';
import { QueryRunner as QR } from 'typeorm';

import { AccessTokenGuard } from 'src/auth/guard/token/access-token.guard';
import { TransactionInterceptor } from 'src/_common/interceptor/transaction.interceptor';
import { QueryRunner } from 'src/_common/decorator/query-runner.decorator';
import { User } from 'src/users/decorator/user.decorator';

import { IsPublic } from 'src/_common/decorator/is-public.decorator';
import { Roles } from 'src/users/decorator/roles.decorator';
import { RoleType } from 'src/users/const/role.type';
import { Logger } from '@nestjs/common';
import { BoardUseCase } from 'src/boards/usecase/board.use-case';
import { PostsUseCases } from '../usecase/post.use-case';
import { CreatePostDto } from '../dto/create-post.dto';
import { GetPaginatedPostsQueryDTO } from '../dto/get-paginated-posts.dto';
import { QuestPostOwnerGuard } from '../guard/quest-post-owner.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { UpdatePostDto } from '../dto/update-post.dto';
import { SbPostOwnerGuard } from '../guard/sb-post-owner.guard';
import { UserUseCase } from 'src/users/usecase/user.use-case';
import { TicketModel } from '@/users/_tickets/entities/ticket.entity';
import { CustomValidationPipe } from '@/_common/pipe/custom-validation.pipe';

/*TODO
- Comment list 미포함하여 반환하도록 수정
    - front의 infinite scroll 동작시 fetch를 감소시켜야하므로 수정 필요
*/
@Controller('/sbs')
@UsePipes(CustomValidationPipe)
export class SbPostsController {
    constructor(
        private readonly postUseCase: PostsUseCases,
        private readonly boardUseCase: BoardUseCase,
        private readonly userUseCase: UserUseCase,
    ) {}

    /*TODO
    - Image URL 저장 추가하기
    */

    @Post()
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(TransactionInterceptor)
    async postQuest(
        @User('id') userId: number,
        @Headers('questId') questId: number,
        @Body() body: CreatePostDto,
        @QueryRunner() qr: QR,
    ) {
        const newPost = await this.postUseCase.createSb(userId, questId, body, qr);

        return newPost;
    }

    @Get('/all')
    async getAll() {
        const res = new PostApiResponseDto();
        res.getAll = await this.postUseCase.getAllSbs();
        return res;
    }

    /** TODO paginated 구현 quest와 sb 나눌 것인지 논의*/
    @Get('/paginated')
    async getPaginatedPosts(
        @Query()
        queryParams: GetPaginatedPostsQueryDTO,
    ) {
        const { offset, limit } = queryParams;
        const res = new PostApiResponseDto();
        res.getPaginatedPosts = await this.postUseCase.getPaginatedSbs(offset, limit);

        return res;
    }

    // TODO 복수와 단수를 반환하는 API를 만들고
    // 복수를 반환할때 Query string을 사용하는 로직 추가

    @Get()
    async getSbsByEmail(@Query('email') userEmail: string) {
        let res = new PostApiResponseDto();
        res.getAll = await this.postUseCase.getSbsByEmail(userEmail);

        return res;
    }

    @Get('/:id')
    @IsPublic()
    async geSbtById(@Param('id', ParseIntPipe) id: number) {
        let res = new PostApiResponseDto();
        res.getById = await this.postUseCase.getSbById(id);

        return res;
    }

    @Patch('/:id')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @UseGuards(AccessTokenGuard, SbPostOwnerGuard, RoleGuard)
    @UseInterceptors(TransactionInterceptor)
    async patchSb(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdatePostDto,
        @QueryRunner() qr: QR,
    ) {
        return this.postUseCase.updateSb(id, body);
    }

    @Patch('/:id/increaseFavorite')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @UseGuards(AccessTokenGuard, RoleGuard)
    @UseInterceptors(TransactionInterceptor)
    async patchIncreaseFavorite(
        @Param('id', ParseIntPipe) postId: number,
        @User('id') userId: number,
        @QueryRunner() qr: QR,
    ) {
        const ret = new SbPostApiResponseDto();
        ret.patchSbIncreaseFavorite = await this.postUseCase.increaseSbFavorite(userId, postId, qr);
        return ret;
    }

    @Patch('/:id/decreaseFavorite')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @UseGuards(AccessTokenGuard, RoleGuard)
    @UseInterceptors(TransactionInterceptor)
    async patchDecreaseFavorite(
        @Param('id', ParseIntPipe) postId: number,
        @User('id') userId: number,
        @QueryRunner() qr: QR,
    ) {
        const ret = new SbPostApiResponseDto();
        ret.patchSbDecreaseFavorite = await this.postUseCase.decreaseSbFavorite(userId, postId, qr);
        return ret;
    }

    @Patch('/:id/:isApproval')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @UseGuards(AccessTokenGuard, RoleGuard)
    @UseInterceptors(TransactionInterceptor)
    async patchVote(
        @User('email') userEmail: string,
        @User('ticket') ticket: TicketModel,
        @Param('id', ParseIntPipe) id: number,
        @Param('isApproval', ParseBoolPipe) isApproval: boolean,
        @QueryRunner() qr: QR,
    ) {
        const ret = new PostApiResponseDto();
        if (isApproval) {
            ret.patchVote = await this.postUseCase.appendApproval(userEmail, id, ticket.id, qr);
        } else {
            ret.patchVote = await this.postUseCase.appendDisapproval(userEmail, id, qr);
        }

        return ret;
        // return this.postUseCase.updateSb(id, body);
    }

    @Delete('/:id')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @UseGuards(AccessTokenGuard, SbPostOwnerGuard, RoleGuard)
    @UseInterceptors(TransactionInterceptor)
    async deleteSb(@Param('id', ParseIntPipe) id: number, @QueryRunner() qr: QR) {
        const res = new PostApiResponseDto();
        res.delete = await this.postUseCase.deleteSb(id, qr);

        return res;
    }

    /*TODO
    - 프로토타입 로직 유지 혹은 다른 함수에 병합 고려
    */
    @Get('/board/:boardId')
    async getPostsByBoardId(@Param('boardId', ParseIntPipe) boardId: number) {
        return await this.postUseCase.getSbFromBoard(boardId, 1, 10);
    }

    @Post('/board/:boardId')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @UseGuards(AccessTokenGuard, RoleGuard)
    @UseInterceptors(TransactionInterceptor)
    async addPost(
        @User('id') userId: number,
        @Param('boardId', ParseIntPipe) boardId: number,
        @Body() body: CreatePostDto,
        @QueryRunner() qr: QR,
    ) {
        /*TODO
        - Post 생성시, boardID로 설정하도록 생성로직 변경필요
        - post 생성 후, board에서 생성된 postid 추가 필요
        */
        //await this.boardUseCase.addPost(boardId, newPost.id, qr);
    }

    @Patch('/board/migration')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @UseGuards(AccessTokenGuard, RoleGuard)
    @UseInterceptors(TransactionInterceptor)
    async patchBoardMigration(@Body() body, @QueryRunner() qr: QR) {
        const { boardIdList, postIdList } = body;
        /*TODO
        - 특정 post 리스트를 board에 옮기는 로직 구현 필요.
        - srcboard 에서 dstBoard로 옮기는가
        - 서로다른 board에있는 postf를 특정 dstBoard로 옮기는가
        필요하다면, 여러개 작성 필요
        */
    }
}
