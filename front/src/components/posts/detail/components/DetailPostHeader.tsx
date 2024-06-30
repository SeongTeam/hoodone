'use client';

import { AuthorType } from '@/atoms/post';
import { userAccountState } from '@/atoms/userAccount';
import { customColors } from '@/utils/chakra/customColors';
import { ChevronDownIcon, DragHandleIcon, StarIcon } from '@chakra-ui/icons';
import { Box, Flex, HStack, Text, Image, Spacer } from '@chakra-ui/react';

type DetailPostHeaderProps = {
    writerAccount: userAccountState;
    writer: AuthorType;
    createDate: Date;
};

const DetailPostHeader: React.FC<DetailPostHeaderProps> = ({ writerAccount, createDate }) => {
    const bg = customColors.white[100];
    const borderColor = customColors.shadeLavender[300];

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

                <Text fontSize="12px">{' ~1h'}</Text>
                <Text fontSize="12px">{' ago'}</Text>
            </HStack>
            <Box h={8} w="full" />
            <HStack width="80px">
                <StarIcon boxSize={5} />
                <Spacer> </Spacer>
                <ChevronDownIcon boxSize={7} />
            </HStack>
        </Flex>
    );
};

export default DetailPostHeader;
