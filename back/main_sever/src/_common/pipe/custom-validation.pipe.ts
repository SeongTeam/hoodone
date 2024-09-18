import {
    ArgumentMetadata,
    Injectable,
    Logger,
    ValidationPipe,
    ValidationPipeOptions,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { PipeException } from '../exception/pipe-exception';

const createPipeException = (errors: ValidationError[]) => {
    function getAllConstraints(errorList: ValidationError[]) {
        const constraints: string[] = [];
        for (const e of errorList) {
            if (e.constraints) {
                const vals = Object.values(e.constraints);
                constraints.push(...vals);
            }

            if (e.children) {
                const childConstraints = getAllConstraints(e.children);
                constraints.push(...childConstraints);
            }
        }

        return constraints;
    }

    const message = getAllConstraints(errors);

    return new PipeException('INPUT_INVALIDATION', 'BAD_REQUEST', message);
};

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
    constructor(args?: ValidationPipeOptions) {
        Logger.debug(`create ${JSON.stringify(args, null, 2)}`, 'CustomValidationPipe');
        super({ exceptionFactory: createPipeException, ...args });
    }

    public async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        try {
            Logger.debug('transform run', 'CustomValidationPipe');
            return await super.transform(value, metadata);
        } catch (e) {
            Logger.debug(` ${e.name} exception during transform `, 'CustomValidationPipe');
            throw e;
        }
    }
}
