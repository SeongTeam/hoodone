'use client'

import { Box, Button, Flex, Text} from "@chakra-ui/react"
import { useEffect } from "react"

export default function PostErrorPage({
    error,
    reset,
} : {
    error : Error
    reset : () => void
}) {

    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <Box>
            <Flex
                direction={"column"}
                gap = {"30px"} 
                justifyContent={"center"}
                align={"center"}
                >
                <Text fontSize={"36px"} fontStyle={"Bold"}>Page Error</Text>
                <Button 
                    w= {"200px"}
                    h={"50px"}
                    onClick={() => reset()}>Try Again</Button>
            </Flex>
        </Box>
    );
}