import { useUserAccountWithSSR } from '@/atoms/userAccount';
import { CommentType } from '@/atoms/commen';
import React , { useState, useOptimistic } from 'react';
import { Button,Flex, Input} from '@chakra-ui/react';
import { customColors } from '@/utils/chakra/customColors';
import { AuthorType } from '@/atoms/post';
import { leaveComment } from '@/server-actions/commentAction';
import { useParams } from 'next/navigation';
import { leaveReply } from '@/server-actions/commentAction';


/*TODO
- useOptimistic 사용하여 사용자의 코멘트 즉각적으로 페이지에 반영하기
    - ref: https://ko.react.dev/reference/react/useOptimistic#noun-labs-1201738-(2)
*/
type InputReplyProps = {
    handleAddReply: (comment: CommentType) => void
    handleCancelReply: () => void
    parentComment : CommentType
};

const InputReply : React.FC<InputReplyProps> = ({
    handleAddReply,
    handleCancelReply,
    parentComment,
}) => {

    const buttonColor = customColors.link[100];
    const [ content, setContent ] = useState('');
    const [ userAccount, setUserAccount ] = useUserAccountWithSSR();
    const [ isLoading, setIsLoading ] = useState(false);
    const [ msg, setmsg ] = useState('');
    const params = useParams<{postid:string; } >();

    const handleLeaveInput = () => {
        const formdata = new FormData();
        formdata.append('content', content);
        setIsLoading(true);
        const postid = parseInt(params.postid);
        leaveReply(formdata, postid , parentComment.id).then((newComment) => {

            if(!newComment) {
                setmsg('Comment failed');
                console.log("failed", newComment);
                setIsLoading(false);
                return;
            }
            console.log("newComment", newComment);
            handleAddReply(newComment);
            setIsLoading(false);
            
        });
    }


    return (
        <Flex w="full" flexDirection={"row"}>
            <Input
                type='text'
                autoFocus
                isDisabled={!userAccount.isLogin}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Comment"
                _placeholder={{ color: "gray.500" }}
            >
            </Input>
            <Button
                isLoading={isLoading}
                onClick={() => handleLeaveInput()}
            >
                Comment
            </Button>
            <Button
                onClick={() => handleCancelReply()}
            >
                Cancel
            </Button>
        </Flex>
    )  
}

export default InputReply;