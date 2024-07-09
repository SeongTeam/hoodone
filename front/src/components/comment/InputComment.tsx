'use client';
import { useUserAccountWithSSR } from '@/hooks/userAccount';
import { CommentType } from '@/atoms/comment';
import React, { useState, useOptimistic } from 'react';
import { Box, Button, Container, Flex, HStack, Input, Spacer } from '@chakra-ui/react';
import { customColors } from '@/utils/chakra/customColors';
import { leaveComment } from '@/server-actions/commentAction';
import { useParams, usePathname } from 'next/navigation';

/*TODO
- useOptimistic 사용하여 사용자의 코멘트 즉각적으로 페이지에 반영하기
    - ref: https://ko.react.dev/reference/react/useOptimistic#noun-labs-1201738-(2)
*/
type InputCommentProps = {};

const InputComment: React.FC<InputCommentProps> = ({}) => {
    const buttonColor = customColors.link[100];
    const [content, setContent] = useState('');
    const [userAccount] = useUserAccountWithSSR();
    const [isLoading, setIsLoading] = useState(false);
    const [msg, setmsg] = useState('');
    const params = useParams<{ postid: string }>();
    const path = usePathname();
    const fontColor = customColors.black[100];

    const handleLeaveInput = () => {
        console.log('handleLeaveInput is clicked', content);
        const formdata = new FormData();
        formdata.append('content', content);
        setIsLoading(true);
        const postid = parseInt(params.postid);
        leaveComment(formdata, postid, path).then((newComment) => {
            if (!newComment) {
                setmsg('Comment failed');
                console.log('failed', newComment);
                setIsLoading(false);
                return;
            }

            console.log('newComment', newComment);
            setIsLoading(false);
        });
    };

    return (
        <Flex w="100%" px="12px" py="8px" alignItems="center" h="84px">
            <Input
                type="text"
                autoFocus
                isDisabled={!userAccount.isLogin}
                value={content}
                color={fontColor}
                w="90%"
                h="100%"
                bg={customColors.pastelGreen[300]}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Comment"
                _placeholder={{ color: 'gray.500' }}
            ></Input>
            <Spacer></Spacer>
            <Button
                w="60px"
                h="100% "
                bg={customColors.purple[100]}
                isLoading={isLoading}
                onClick={() => handleLeaveInput()}
            >
                ADD
            </Button>
        </Flex>
    );
};

export default InputComment;
