import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateReportDto } from 'src/auth/report/dto/create_report.dto';
import { ServiceException } from '@/_common/exception/service-exception';

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
                    return response;
                })
                .catch((err) => {
                    throw new ServiceException(
                        'SERVICE_RUN_ERROR',
                        'INTERNAL_SERVER_ERROR',
                        `${to} this.mailerService.sendMail`,
                        { cause: err },
                    );
                });
            return result;
        } catch (e) {
            throw new ServiceException('EXTERNAL_SERVICE_FAILED', 'INTERNAL_SERVER_ERROR', {
                cause: e,
            });
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
                    return response;
                })
                .catch((err) => {
                    Logger.error(`[MailService][sendReport] error`, JSON.stringify(err));
                    throw new ServiceException(
                        'SERVICE_RUN_ERROR',
                        'INTERNAL_SERVER_ERROR',
                        `${to} this.mailerService.sendMail`,
                        { cause: err },
                    );
                });
            return result;
        } catch (e) {
            throw new ServiceException('EXTERNAL_SERVICE_FAILED', 'INTERNAL_SERVER_ERROR', {
                cause: e,
            });
        }
    }
}
