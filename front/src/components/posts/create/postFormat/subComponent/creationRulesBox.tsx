import { createRuleCardTexts } from '@/components/posts/card/const/rule_card_texts';
import { customColors } from '@/utils/chakra/customColors';
import { Box, Text, VStack } from '@chakra-ui/react';

type CreationRulesBoxProps = {
    isQuestPost: boolean;
};

const CreationRulesBox: React.FC<CreationRulesBoxProps> = ({ isQuestPost }) => {
    const outsideBg = customColors.white;
    const insideBg = customColors.pastelGreen[100];
    const BorderColor = customColors.shadeLavender[300];
    const rules: string[] = isQuestPost ? createRuleCardTexts.quest : createRuleCardTexts.sb;
    // const rule1 = '1. Check your Quest creation ticket';
    // const rule2 = '2. Create Simple and Easy Quest';
    // const rule3 = '3. Express your quest on title';

    return (
        <Box
            height="250px"
            // width={{ sm: '70%', base: '90%', lg: '100%' }}
            py="20px"
            px="12px"
            bg={outsideBg}
            borderRadius="15px"
            border={`1px solid ${BorderColor}`}
        >
            <Text fontSize="1.4em"> Create Rule</Text>
            <VStack spacing="3px" p="12px" bg={insideBg} align="left">
                <Text mt="4px" noOfLines={3} fontSize="1.2em" color="black" whiteSpace="pre-line">
                    {rules[0]}
                </Text>
                <Text mt="4px" noOfLines={2} fontSize="1.2em" color="black" whiteSpace="pre-line">
                    {rules[1]}
                </Text>
                <Text mt="4px" noOfLines={2} fontSize="1.2em" color="black" whiteSpace="pre-line">
                    {rules[2]}
                </Text>
            </VStack>
        </Box>
    );
};

export default CreationRulesBox;
