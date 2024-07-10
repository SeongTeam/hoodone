import React from "react";
import { SlPlus, SlMinus } from "react-icons/sl";
import { IconButton } from "@chakra-ui/react";


type ReplyToggleButtonProps = {
    isShowReply: boolean;
    handleShowReplyIconClicked: () => void;
};

const ReplyToggleButton: React.FC<ReplyToggleButtonProps> = ({
    isShowReply,
    handleShowReplyIconClicked,
}) => (
    <IconButton
        isRound={true}
        aria-label="Toggle Reply Comments"
        icon={isShowReply ? <SlMinus size="20px" color="black"/> : <SlPlus size="20px" color="black" />}
        onClick={handleShowReplyIconClicked}
        size="sm"
        bg="none"
        _hover={{bg: "none"}}
    />
);

export default ReplyToggleButton;