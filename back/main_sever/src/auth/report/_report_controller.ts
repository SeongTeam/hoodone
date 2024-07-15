import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guard/token/access-token.guard';
import { User } from 'src/users/decorator/user.decorator';
import { CreateReportDto } from './dto/create_report.dto';
import { MailUseCase } from 'src/mail/usecase/mail.usecase';

@Controller('reports')
export class ReportController {
    constructor(private readonly mailUseCase: MailUseCase) {}
    @Post('/send')
    @UseGuards(AccessTokenGuard)
    async post(@User('id') userID: number, @Body() body: CreateReportDto) {
        const result = await this.mailUseCase.sendReport(userID, body);

        const res = typeof result.response === 'string' ? result.response : '';

        return { res };
    }
}
