import React from 'react';
import { Box, Text, Flex, Icon, Image } from '@chakra-ui/react';
import { FaSquare } from 'react-icons/fa';
import { customColors } from '@/utils/chakra/customColors';
import { createIcon } from '@chakra-ui/react';

const Panel = () => {
    const bg = customColors.pastelGreen[100];
    const r = 60;
  return (
    <Box
      bg={bg}
      p={6}
      borderRadius="15px"
      boxShadow="md"
      position="relative"
    >
      <Flex
        bg={bg}
        w={`${r}px`}
        h={`${r}px`}
        borderRadius="full"
        justify="center"
        align="center"
        position="absolute"
        top={`-${r / 2}px`}
        left="50%"
        transform="translateX(-50%)"
      >
        <Image src ="/smallQuest/cube.svg" alt='cube shape icon'/>
      </Flex>
      <Text fontWeight="semibold" mb={2}>
        Bring experiences into your life.
      </Text>
      <Text>Well begun is half done.</Text>
    </Box>
  );
};

export default Panel;
