import { useUserAccountWithSSR } from "@/hooks/userAccount";
import { CommentType } from '@/atoms/comment';
import React , { useState, useOptimistic } from 'react';
import { Button,Box, Flex, Input, Text, Textarea} from '@chakra-ui/react';
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
    const params = useParams<{postid:string; } >();
    const path = usePathname();

    const handleLeaveInput = () => {
        const formdata = new FormData();
        formdata.append('content', content);
        if(content.length <= 0) {
            alert('Reply is empty');
            return;
        }

        setIsLoading(true);
        const postid = parseInt(params.postid);
        leaveReply(formdata, postType, postid , parentComment.id , path).then(() => {
            setIsLoading(false);
            handleAddReply();
            
        }).catch((err) => {
            alert('Reply failed, please retry later');
            setIsLoading(false);
        });

        setContent('');
    }


    return (
        <Box w="full" flexDirection={"column"}>
            <Textarea
                autoFocus
                isDisabled={!userAccount.isLogin}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                bg= {customColors.white[100]}
                color={customColors.black[100]}
                placeholder="Please, Leave a Reply"
            />
            <Flex mt = "10px" gap="10px">
                <Button
                    isLoading={isLoading}
                    variant={'purple'}
                    onClick={() => handleLeaveInput()}
                >
                    Reply
                </Button>
                <Button
                    variant = 'cancel'
                    onClick={() => handleCancelReply()}   
                >
                    Cancel
                </Button>
            </Flex>
        </Box>
    )  
}

export default InputReply;