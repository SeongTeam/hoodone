import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateReportDto } from 'src/auth/report/dto/create_report.dto';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendCertificationPinCode(to: string, pinCode: string) {
        // const mock = toEmail.toString();

        try {
            const result = await this.mailerService
                .sendMail({
                    to,
                    subject: 'Test email',
                    context: {
                        pinCode,
                    },
                    template: './email',
                })
                .then((response) => {
                    console.log(response);
                    return response;
                })
                .catch((err) => {
                    console.log(err);
                    throw new BadRequestException(`${to} this.mailerService.sendMail`);
                });
            return result;
        } catch (e) {
            console.log(e);

            throw new BadRequestException(' this.mailerService.sendMail');
        }
    }
    async generatePinCode(): Promise<string> {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async sendReport(userId: number, sendDto: CreateReportDto) {
        const to = 'hoodone9090@gmail.com';

        try {
            const result = await this.mailerService
                .sendMail({
                    to,
                    subject: 'Report email',
                    context: { userId, ...sendDto },
                    template: './report',
                })
                .then((response) => {
                    console.log(response);
                    return response;
                })
                .catch((err) => {
                    console.log(err);
                    throw new BadRequestException(`${to} this.mailerService.sendMail`);
                });
            return result;
        } catch (e) {
            console.log(e);

            throw new BadRequestException(' this.mailerService.sendMail');
        }
    }
}
