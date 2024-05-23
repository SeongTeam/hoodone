import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { Repository } from 'typeorm/repository/Repository';
import { QueryRunner } from 'typeorm/query-runner/QueryRunner';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendCertificationPinCode(to: string, pinCode: string) {
        // const mock = toEmail.toString();

        console.log(to);

        try {
            const result = await this.mailerService
                .sendMail({
                    to,
                    subject: 'Test email',
                    text: 'Hello, world!',
                    context: {
                        pinCode,
                        // // pinCode: pinCode.toString(),
                        // pinCode: '1234',
                    },
                    template: './email',
                })
                .then((response) => {
                    console.log(response);
                    return response;
                })
                .catch((err) => {
                    console.log(err);
                    throw new BadRequestException(' this.mailerService.sendMail');
                });
            return result;
        } catch (e) {
            console.log(e);
            console.log('12345678i9');

            throw new BadRequestException(' this.mailerService.sendMail');
        }
    }
    async generatePinCode(): Promise<string> {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
}

// async sendEmail(){

//  mailerService
//                 .sendMail({
//                     to: `sjm4126@naver.com`,
//                     subject: 'Test email',
//                     text: 'Hello, world!',
//                     context: {
//                         pinCode,
//                         // // pinCode: pinCode.toString(),
//                         // pinCode: '1234',
//                     },
//                     template: './email',
//                 })

//             }
