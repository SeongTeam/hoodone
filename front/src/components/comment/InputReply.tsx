import { useUserAccountWithSSR } from "@/hooks/userAccount";
import { CommentType } from '@/atoms/comment';
import React , { useState, useOptimistic } from 'react';
import { Button,Flex, Input, Text, Textarea} from '@chakra-ui/react';
import { customColors } from '@/utils/chakra/customColors';
import { AuthorType, POST_TYPE } from '@/type/postType';
import { leaveComment } from '@/server-actions/commentAction';
import { useParams , usePathname} from 'next/navigation';
import { leaveReply } from '@/server-actions/commentAction';


type InputReplyProps = {
    handleAddReply: () => void
    handleCancelReply: () => void
    parentComment : CommentType
    postType : POST_TYPE
};

const InputReply : React.FC<InputReplyProps> = ({
    handleAddReply,
    handleCancelReply,
    parentComment,
    postType,
}) => {

    const buttonColor = customColors.link[100];
    const [ content, setContent ] = useState('');
    const [userAccount] = useUserAccountWithSSR();
    const [ isLoading, setIsLoading ] = useState(false);
    const [ msg, setmsg ] = useState('');
    const params = useParams<{postid:string; } >();
    const path = usePathname();

    const handleLeaveInput = () => {
        const formdata = new FormData();
        formdata.append('content', content);
        setIsLoading(true);
        const postid = parseInt(params.postid);
        leaveReply(formdata, postType, postid , parentComment.id , path).then(() => {
            setIsLoading(false);
            handleAddReply();
            
        }).catch((err) => {
            setmsg('Reply failed');
            setIsLoading(false);
        });

        setContent('');
    }


    return (
        <Flex w="full" flexDirection={"column"} gap={"0.5rem"}>
            <Text color={customColors.error[100]}>{msg}</Text>
            <Textarea
                autoFocus
                isDisabled={!userAccount.isLogin}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                bg= {customColors.black[200]}
                color={customColors.white[300]}
                placeholder="Please, Leave a Reply"
                _placeholder={{ color: "gray.500" }}
            >
            </Textarea>
            <Flex gap="0.5rem">
                <Button
                    isLoading={isLoading}
                    onClick={() => handleLeaveInput()}
                    color={customColors.black[300]}
                    bg={buttonColor}
                >
                    Reply
                </Button>
                <Button
                    onClick={() => handleCancelReply()}
                    bg={customColors.black[200]}
                >
                    Cancel
                </Button>
            </Flex>
        </Flex>
    )  
}

export default InputReply;