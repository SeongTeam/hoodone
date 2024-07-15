import { Inject, Injectable } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';
import { QueryRunner } from 'typeorm';

import { Logger } from '@nestjs/common';
import { MailService } from '../mail.service';
import { CreateReportDto } from 'src/auth/report/dto/create_report.dto';

@Injectable()
export class MailUseCase {
    constructor(
        @Inject(forwardRef(() => MailService))
        private readonly mailService: MailService,
        // private readonly userUseCase: UserUseCase,
    ) {}

    async sendCertificationPinCode(to: string, pinCode) {
        // const pinCode = await this.mailService.generatePinCode();
        return this.mailService.sendCertificationPinCode(to, pinCode);
    }

    async sendReport(userid: number, sendDto: CreateReportDto) {
        return await this.mailService.sendReport(userid, sendDto);
    }
}
