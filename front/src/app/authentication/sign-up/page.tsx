import { Box, Text, Flex } from "@chakra-ui/react";
import Link from "next/link";
import Login from "@/components/modal/auth/login";
import { customColors } from "@/utils/chakra/customColors";
import Brand from "@/components/common/Brand";
import SignUp from "@/components/modal/auth/signUp";

export default function SignInPage() {

    const linkColor = customColors.purple[100];
    const infoFontSize = "16px";
    return (

        <Box 
            w="full" 
            h="full"
        >
            <Brand/>
            <Flex mt= "20px" direction="column">
                <Box>
                    <Text
                        fontSize = "36px"
                    >
                        Create Account
                    </Text>
                    <Text fontSize = {infoFontSize} color={customColors.gray[300]}>
                        Enjoy Quest and create Your quests
                    </Text>
                </Box>
                <SignUp/>
            </Flex>
            <Flex
                direction={ {base : "column" , md : "row"} }
                mt= "20px" 
                gap = "10px" 
                justify={"center"}
                align={"center"}>
                <Text 
                    fontSize = {infoFontSize}
                    color={customColors.black[100]}
                >
                    already have an account? 
                </Text>
                <Link href="/authentication/sign-in"> 
                    <Text fontWeight="bold" fontSize = {infoFontSize} color={linkColor}>
                        Sign In!
                    </Text> 
                </Link>
            </Flex>
        </Box>
        

    );
}