'use client';

import { AuthorType } from '@/atoms/post';
import { userAccountState } from '@/atoms/userAccount';
import { formatTimeFromNow } from '@/lib/Date';
import { customColors } from '@/utils/chakra/customColors';
import { ChevronDownIcon, DragHandleIcon, StarIcon } from '@chakra-ui/icons';
import { Box, Flex, HStack, Text, Image, Spacer } from '@chakra-ui/react';

type DetailPostHeaderProps = {
    writerAccount: userAccountState;
    writer: AuthorType;
    createDate: Date;
};

const DetailPostHeader: React.FC<DetailPostHeaderProps> = ({ writerAccount, createDate }) => {
    const time = formatTimeFromNow(createDate);

    return (
        <Flex w="100%" direction="row" pl="15px" pr="3px">
            <HStack w="100%" align="center">
                <Image
                    borderRadius="full"
                    boxSize="60px"
                    src="https://bit.ly/dan-abramov"
                    alt="Dan Abramov"
                />
                <Spacer w="2px" />
                <Text w="180px" fontSize="16px">
                    mock autour
                </Text>
                {/* TODO  write 시간 기록하기 동작 에러 확인하기 */}
                {/* <Spacer width="100px" /> */}
            </HStack>
            <Box h={8} w="full" />
            <HStack width="200px">
                <Text w="90px" noOfLines={1} fontSize="12px">
                    {time}
                </Text>
                <StarIcon boxSize={5} />
                <Spacer> </Spacer>
                <ChevronDownIcon boxSize={7} />
            </HStack>
        </Flex>
    );
};

export default DetailPostHeader;
