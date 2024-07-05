import { Injectable } from '@nestjs/common/decorators';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { TicketService } from '../ticket.service';
import { UserModel } from 'src/users/entities/user.entity';
import { TicketModel } from '../entities/ticket.entity';

@Injectable()
export class TicketUseCase {
    constructor(private readonly ticketService: TicketService) {}

    async create(qr: QueryRunner) {
        return await this.ticketService.create(qr);
    }

    async addUser(ticket: TicketModel, user: UserModel, qr: QueryRunner) {
        return await this.ticketService.addUser(ticket.id, user, qr);
    }

    async incrementCount(ticketId: number, qr: QueryRunner) {
        const result = this.ticketService.incrementCount(ticketId, qr);
        console.log(result);
        return result;
    }

    async decrementCount(ticketId: number, qr: QueryRunner) {
        const result = this.ticketService.decrementCount(ticketId, qr);
        return result;
    }
}
