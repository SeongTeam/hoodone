import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { QueryRunner, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TicketModel } from './entities/ticket.entity';
import { UserModel } from 'src/users/entities/user.entity';

const TICKET_INIT_COUNT = 10;
const INCREASE_COUNT = 1;
const DECREASE_COUNT = 1;

type UsageType = 'increase' | 'decrease' | 'init';

@Injectable()
export class TicketService {
    constructor(
        @InjectRepository(TicketModel)
        private readonly ticketRepository: Repository<TicketModel>,
    ) {}

    async create(qr: QueryRunner) {
        const repository = this._getRepository(qr);
        const usageText = this._usageTexts('init');

        let newTicket = await repository.create({
            count: TICKET_INIT_COUNT,
            usageHistory: usageText,
        });
        const result = await repository.save(newTicket);
        return result;
    }
    async addUser(ticketId: number, user: UserModel, qr: QueryRunner) {
        const repository = this._getRepository(qr);
        return await repository.update(ticketId, {
            user,
        });
    }
    async save(ticket: TicketModel, qr: QueryRunner) {
        const repository = this._getRepository(qr);

        return await repository.save(ticket);
    }

    async incrementCount(ticketId: number, qr: QueryRunner) {
        const repository = this._getRepository(qr);
        this.updateUsageHistory({ ticketId, usageType: 'increase' }, qr);

        return await repository.increment(
            {
                id: ticketId,
            },
            'count',
            INCREASE_COUNT,
        );
    }

    async decrementCount(ticketId: number, qr: QueryRunner) {
        const repository = this._getRepository(qr);
        this.updateUsageHistory({ ticketId, usageType: 'decrease' }, qr);
        const ticket = await repository.findOneBy({
            id: ticketId,
        });
        if (ticket.count <= 0) throw new BadRequestException('0보다는 작아질 수 없습니다');

        return await repository.decrement(
            {
                id: ticketId,
            },
            'count',
            DECREASE_COUNT,
        );
    }

    async updateUsageHistory(param: { ticketId: number; usageType: UsageType }, qr: QueryRunner) {
        const { ticketId, usageType } = param;

        const usage = this._usageTexts(usageType);
        const repository = this._getRepository(qr);
        const ticket = await repository.findOneBy({
            id: ticketId,
        });

        return repository.update(ticketId, {
            usageHistory: ticket.usageHistory + usage,
        });
    }

    _usageTexts(usageType: UsageType): string {
        const now = new Date().toString();

        switch (usageType) {
            case 'increase':
                return `\nIncrease the number of tickets by one ${now}`;

            case 'decrease':
                return `\nDecrease the number of tickets by one ${now}`;

            case 'init':
                return 'init ticket count';
        }
    }

    _getRepository(qr?: QueryRunner) {
        return qr ? qr.manager.getRepository<TicketModel>(TicketModel) : this.ticketRepository;
    }
}
