import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common/decorators';
import { PostsUseCases } from '../usecase/post.use-case';
import { BoardUseCase } from 'src/boards/usecase/board.use-case';
import { User } from 'src/users/decorator/user.decorator';
import { CreatePostDto } from '../dto/create-post.dto';
import { QueryRunner } from 'src/_common/decorator/query-runner.decorator';
import { Entity, QueryRunner as QR } from 'typeorm';
import { AccessTokenGuard } from 'src/auth/guard/token/access-token.guard';
import { TransactionInterceptor } from 'src/_common/interceptor/transaction.interceptor';
import { PostApiResponseDto } from '@/sharedModule/response-dto/post-api-reponse.dto';
import { QuestPostApiResponseDto } from '@/sharedModule/response-dto/quest-post-api-response.dto';
import { GetPaginatedPostsQueryDTO } from '../dto/get-paginated-posts.dto';
import { IsPublic } from 'src/_common/decorator/is-public.decorator';
import { ParseBoolPipe, ParseIntPipe } from '@nestjs/common/pipes';
import { Roles } from 'src/users/decorator/roles.decorator';
import { RoleType } from 'src/users/const/role.type';
import { QuestPostOwnerGuard } from '../guard/quest-post-owner.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Logger } from '@nestjs/common';
import { UserModel } from 'src/users/entities/user.entity';
import { UserUseCase } from 'src/users/usecase/user.use-case';
import { FavoriteService } from 'src/favorite/favorite.service';
import { TicketModel } from '@/users/_tickets/entities/ticket.entity';
import { CustomValidationPipe } from '@/_common/pipe/custom-validation.pipe';

/*TODO
- Comment list 미포함하여 반환하도록 수정
    - front의 infinite scroll 동작시 fetch를 감소시켜야하므로 수정 필요
*/

@Controller('quests')
@UsePipes(
    new CustomValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }),
)
export class QuestPostsController {
    constructor(
        private readonly postUseCase: PostsUseCases,
        private readonly boardUseCase: BoardUseCase,
    ) {}

    /*TODO
    - Image URL 저장 추가하기
    */
    @Post()
    @UseGuards(AccessTokenGuard)
    @UseInterceptors(TransactionInterceptor)
    async post(
        @User('id') userId: number,
        @User('ticket') ticket: TicketModel,
        @Body()
        body: CreatePostDto,
        @QueryRunner() qr: QR,
    ) {
        const res = new PostApiResponseDto();
        res.post = await this.postUseCase.createQuest(userId, body, ticket.id, qr);

        return res;
    }

    @Get('/all')
    async getAll() {
        const res = new PostApiResponseDto();
        res.getAll = await this.postUseCase.getAllQuests();
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
        res.getPaginatedPosts = await this.postUseCase.getPaginatedQuests(offset, limit);

        return res;
    }

    @Get('/admin-paginated')
    async getAdminQuests(
        @Query()
        queryParams: GetPaginatedPostsQueryDTO,
    ) {
        const { offset, limit } = queryParams;
        const res = new PostApiResponseDto();

        res.getPaginatedPosts = await this.postUseCase.getPaginateAdminQuests(offset, limit);

        return res;
    }

    // TODO 복수와 단수를 반환하는 API를 만들고
    // 복수를 반환할때 Query string을 사용하는 로직 추가
    @Get()
    async getQuestsByEmail(@Query('email') userEmail: string) {
        let res = new PostApiResponseDto();
        res.getAll = await this.postUseCase.getQuestsByEmail(userEmail);

        return res;
    }

    @Get('/:id')
    @IsPublic()
    async getById(@Param('id', ParseIntPipe) id: number) {
        let res = new PostApiResponseDto();
        res.getById = await this.postUseCase.getQuestById(id);

        return res;
    }
    @Get('/:id/sbs')
    async getRelatedSbs(
        @Param('id', ParseIntPipe) id: number,
        @Query()
        queryParams: GetPaginatedPostsQueryDTO,
    ) {
        const { offset, limit } = queryParams;
        const res = new QuestPostApiResponseDto();
        res.getPaginatedSbs = await this.postUseCase.getRelatedSbs(id, offset, limit);

        return res;
    }

    @Patch('/:id')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @UseGuards(AccessTokenGuard, QuestPostOwnerGuard, RoleGuard)
    @UseInterceptors(TransactionInterceptor)
    async patch(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: UpdatePostDto,
        @QueryRunner() qr: QR,
    ) {
        Logger.log('/quests/:id [patch]', { message: body });
        return this.postUseCase.updateQuest(id, body);
    }

    @Patch('/:id/increaseFavorite')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @UseGuards(AccessTokenGuard, RoleGuard)
    @UseInterceptors(TransactionInterceptor)
    async patchIncreaseFavorite(
        @Param('id', ParseIntPipe) postId: number,
        // @Param('isFavorite', ParseBoolPipe) isFavorite: boolean,
        @User('id') userId: number,
        @QueryRunner() qr: QR,
    ) {
        const ret = new QuestPostApiResponseDto();
        ret.patchQuestIncreaseFavorite = await this.postUseCase.increaseQuestFavorite(
            userId,
            postId,
            qr,
        );

        return ret;
    }

    @Patch('/:id/decreaseFavorite')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @UseGuards(AccessTokenGuard, RoleGuard)
    @UseInterceptors(TransactionInterceptor)
    async patchDecreaseFavorite(
        @Param('id', ParseIntPipe) postId: number,
        // @Param('isFavorite', ParseBoolPipe) isFavorite: boolean,
        @User('id') userId: number,
        @QueryRunner() qr: QR,
    ) {
        const ret = new QuestPostApiResponseDto();
        ret.patchQuestDecreaseFavorite = await this.postUseCase.decreaseQuestFavorite(
            userId,
            postId,
            qr,
        );
        return ret;
    }

    @Delete('/:id')
    @Roles(RoleType.USER, RoleType.ADMIN)
    @UseGuards(AccessTokenGuard, QuestPostOwnerGuard, RoleGuard)
    @UseInterceptors(TransactionInterceptor)
    async deleteQuest(@Param('id', ParseIntPipe) id: number, @QueryRunner() qr: QR) {
        const res = new PostApiResponseDto();
        res.delete = await this.postUseCase.deleteQuest(id, qr);
        return res;
    }

    /*TODO
    - 프로토타입 로직 유지 혹은 다른 함수에 병합 고려
    */
    @Get('/board/:boardId')
    async getPostsByBoardId(@Param('boardId', ParseIntPipe) boardId: number) {
        return await this.postUseCase.getQuestFromBoard(boardId, 1, 10);
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
