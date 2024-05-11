import { Box, VStack } from "@chakra-ui/react";

/*TODO
- Side bar 만들기
*/

export default function PostCreateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <VStack h="100vh">
        <Box>

        </Box>
        {children}
        <Box>

        </Box>
    </VStack>

  );
}
