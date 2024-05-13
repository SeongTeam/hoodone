import { Flex, Image, Icon, keyframes, Text, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import React from 'react';

const Icons: React.FC = () => {
    const router = useRouter();
    return (
        <Flex>
            <>
                <Flex ml={{ md: '40px', xl: '80px' }}>
                    <Image
                        src="/hood1/alarmIcon.svg"
                        boxSize="50px"
                        alt="alert event user recieved"
                    />
                </Flex>
                <Flex
                    ml={{ md: '10px', xl: '40px' }}
                    mr={{ md: '10px', xl: '40px' }}
                    cursor="pointer"
                    onClick={() => alert('Route to Create Post Page')}
                >
                    <Image src="/hood1/postIcon.svg" boxSize="50px" alt="create new post" />
                </Flex>
            </>
        </Flex>
    );
};
export default Icons;
