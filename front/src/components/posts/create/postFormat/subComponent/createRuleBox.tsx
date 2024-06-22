'use client';

import { customColors } from '@/utils/chakra/customColors';
import { Box, Text, VStack } from '@chakra-ui/react';

type CreateRuleBoxProps = {};

const CreateRuleBox: React.FC<any> = ({}) => {
    const outsideBg = customColors.white;
    const insideBg = customColors.pastelGreen[100];
    const BorderColor = customColors.shadeLavender[300];
    const rule1 = '1. Check your Quest creation ticket';
    const rule2 = '2. Create Simple and Easy Quest';
    const rule3 = '3. Express your quest on title';

    return (
        <Box
            height="250px"
            width={{ sm: '70%', base: '90%', lg: '100%' }}
            py="20px"
            px="12px"
            bg={outsideBg}
            borderRadius="15px"
            border={`1px solid ${BorderColor}`}
        >
            <Text fontSize="1.4em"> Create Rule</Text>
            <VStack spacing="3px" p="12px" bg={insideBg}>
                <Text mt="4px" noOfLines={2} fontSize="1.2em" color="black" whiteSpace="pre-line">
                    {rule1}
                </Text>
                <Text mt="4px" noOfLines={2} fontSize="1.2em" color="black" whiteSpace="pre-line">
                    {rule2}
                </Text>
                <Text mt="4px" noOfLines={2} fontSize="1.2em" color="black" whiteSpace="pre-line">
                    {rule3}
                </Text>
            </VStack>
        </Box>
    );
};

export default CreateRuleBox;
