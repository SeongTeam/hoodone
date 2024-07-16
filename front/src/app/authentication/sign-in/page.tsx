import { Box, Text, Flex } from "@chakra-ui/react";
import Link from "next/link";
import Login from "@/components/authentication/login";
import { customColors } from "@/utils/chakra/customColors";
import Brand from "@/components/common/Brand";

export default function SignInPage() {

    const linkColor = customColors.purple[100];
    const infoFontSize = "16px";
    return (

        <Box 
            w="full" 
            h="full"
        >
            <Brand/>
            <Flex direction="column">
                <Box>
                    <Text
                        fontSize = "36px"
                    >
                        Log In
                    </Text>
                    <Text fontSize = {infoFontSize} color={customColors.gray[300]}>
                        Enjoy Quest and Create your quests
                    </Text>
                </Box>
                <Login/>
            </Flex>
            <Flex gap = "10px">
                <Text 
                    fontSize = {infoFontSize}
                    color={customColors.black[100]}>
                    Do you want to create an account? 
                </Text>
                <Link href="/authentication/sign-up"> 
                    <Text fontWeight="bold" fontSize = {infoFontSize} color={linkColor}>
                        Create Account!
                    </Text> 
                </Link>
            </Flex>
        </Box>
        

    );
}