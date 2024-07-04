import { Icon } from "@iconify-icon/react/dist/iconify.mjs";
import { Button, Box, Flex, Text } from "@chakra-ui/react";
import { customColors } from "@/utils/chakra/customColors";
import { useRouter } from "next/navigation";

const LoginButton : React.FC = () => {

    const router = useRouter();
    const bg = customColors.purple[100];
    const boxColor = customColors.white[100];

    const handleLoginButtonClick = () => {
        router.push('/authentication/sign-in');
    }

    return (
        <Button
            w = {{ base : "100px" ,  lg: "130px"}}
            h = "40px"
            variant="outline"
            colorScheme="blue"
            size="sm"
            bg = { bg }
            onClick={() => handleLoginButtonClick()}
            color = { boxColor }
            border = "1px solid"
            borderColor = { customColors.shadeLavender[100] }
            _hover={{ bg: customColors.purple[200] }}
            _active={{ bg }}
            >
                <Flex gap="15px" px = "8px" py = "10px" justify={"center"}> 
                    <Box 
                    >
                        <Icon 
                            icon="ph:sign-in-bold"  
                            width="24px" 
                            height="24px"
                        />
                    </Box>
                    <Text 
                        display={{  base : "none" ,  md: "block"} }
                        fontSize="20px"
                    >
                        Sign In
                    </Text>
                </Flex>
            </Button>

    );

}

export default LoginButton;