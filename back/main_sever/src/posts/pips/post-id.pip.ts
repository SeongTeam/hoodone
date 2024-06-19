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
        console.log('value', value);
        console.log('metadata', metadata);
        // let postId: PostId;

        const split = value.split(':');
        if (split[0] == 'quest') {
            const postId = { postType: PostType.QUEST, postId: +split[1] };
            // postId.postId = +split[1];
            // postId.postType = PostType.QUEST;
            console.log(split, postId);
            // return postId;
        } else if (split[0] == 'sb') {
            const postId = { postType: PostType.QUEST, postId: +split[1] };

            // postId.postId = +split[1];
            // postId.postType = PostType.SB;
            console.log(split, postId);
            // return postId;
        }
        return;
    }
}
