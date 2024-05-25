import { Inject, Injectable } from '@nestjs/common/decorators';
import { forwardRef } from '@nestjs/common/utils';
import { QueryRunner } from 'typeorm';

import { AuthException } from 'src/common/exception/auth-exception';
import { UserUseCase } from 'src/users/usecase/user.use-case';
import { UserModel } from 'src/users/entities/user.entity';

import { Logger } from '@nestjs/common';
import { MailService } from '../mail.service';

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
}
