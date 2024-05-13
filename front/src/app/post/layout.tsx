import { Flex } from "@chakra-ui/react";


export default function PostLayout({ children }: { children: React.ReactNode }) {
    return (
        <Flex mt ="1rem" w= "full">
            <Flex w={"30rem"}>
                Sider bar
            </Flex>
            <Flex w="full">
                {children}
            </Flex>
            <Flex w={"53rem"} h="full">
                side right
            </Flex>
        </Flex>
    );
}