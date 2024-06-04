import React from "react";
import { SlPlus, SlMinus } from "react-icons/sl";
import { IconButton } from "@chakra-ui/react";


type ReplyToggleButtonProps = {
    isShowReply: boolean;
    handleShowReplyIconClicked: () => void;
    fontSize: string;
};

const ReplyToggleButton: React.FC<ReplyToggleButtonProps> = ({
    isShowReply,
    handleShowReplyIconClicked,
    fontSize
}) => (
    <IconButton
        isRound={true}
        aria-label="Toggle Reply Comments"
        icon={isShowReply ? <SlMinus size={fontSize} /> : <SlPlus size={fontSize} />}
        onClick={handleShowReplyIconClicked}
        size="sm"
        bg="none"
        border="none"
    />
);

export default ReplyToggleButton;