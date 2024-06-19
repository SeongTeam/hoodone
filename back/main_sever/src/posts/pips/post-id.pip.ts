import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export enum PostType {
    QUEST = 'QUEST',
    SB = 'SB',
}

export interface PostId {
    postType: PostType;
    id: number;
}

export class PostIdPip implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): PostId {
        // let postId: PostId;

        const split = value.split(':');
        if (split[0] == 'quest') {
            const postId = { postType: PostType.QUEST, id: +split[1] };

            return postId;
        } else if (split[0] == 'sb') {
            const postId = { postType: PostType.QUEST, id: +split[1] };

            return postId;
        }
        return;
    }
}
