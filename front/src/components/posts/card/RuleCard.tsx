import { customColors } from '@/utils/chakra/customColors';
import { Flex, VStack, Text, ResponsiveValue } from '@chakra-ui/react';

/** md와 xl를 사용할 거라면 'block'과 'none ' 중에서만 사용하세요
 *
 * ex => { md: 'none', xl: 'block' }
 */
type DisplayOption = {
    md?: string;
    xl?: string;
    lg?: string;
    sm?: string;
};

type RuleCardProps = {
    bg?: string;
    title: string;
    cardTexts: string[];
    displayOption: DisplayOption;
};

/**TODO 다른 post 페이지세서도 사요할 수 있도록 변경 */
const RuleCard: React.FC<RuleCardProps> = ({ title, cardTexts, displayOption, bg }) => {
    const outsideBg = customColors.white;
    const insideBg = customColors.pastelGreen[100];
    const BorderColor = customColors.shadeLavender[300];

    return (
        <Flex
            flexDirection="column"
            display={{
                sm: displayOption.sm ?? 'none',
                md: displayOption.md ?? 'none',
                lg: displayOption.lg ?? 'none',
                xl: displayOption.xl ?? 'block',
            }}
            align="center"
            justify="center"
            height="220px"
            w="100%"
            py="20px"
            px="12px"
            bg="white"
            borderRadius="15px"
            border={`1px solid ${BorderColor}`}
        >
            <Text fontSize="1.4em"> Create Rule</Text>
            <VStack spacing="3px" px="12px" bg={insideBg} align="left">
                <Text mt="4px" noOfLines={3} fontSize="1.2em" color="black" whiteSpace="pre-line">
                    {cardTexts[0]}
                </Text>
                <Text mt="4px" noOfLines={2} fontSize="1.2em" color="black" whiteSpace="pre-line">
                    {cardTexts[1]}
                </Text>
                <Text mt="4px" noOfLines={2} fontSize="1.2em" color="black" whiteSpace="pre-line">
                    {cardTexts[2]}
                </Text>
            </VStack>
        </Flex>
    );
};

export default RuleCard;
