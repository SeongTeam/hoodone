import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { Button, Box, Flex, Text } from "@chakra-ui/react";
import { customColors } from "@/utils/chakra/customColors";
import { Router } from "next/router";

const LoginButton : React.FC = () => {

    const bg = customColors.purple[100];
    const boxColor = customColors.white[100];

    return (
        <Button
            w = {{ base : "100px" ,  lg: "130px"}}
            h = "full"
            variant="outline"
            colorScheme="blue"
            size="sm"
            bg = { bg }
            onClick={() => alert('Route to Login Page')}
            color = { boxColor }
            border = "1px solid"
            borderColor = { customColors.shadeLavender[100] }
            _hover={{ bg: customColors.purple[200] }}
            _active={{ bg }}
            >
                <Flex gap="15px" px = "8px" py = "10px"> 
                    <Icon icon="ph:sign-in-bold"  width="24px" height="24px" />
                    <Text fontSize={{base : "16px" ,  lg: "20px"} }>Sign In</Text>
                </Flex>
            </Button>

    );

}

export default LoginButton;