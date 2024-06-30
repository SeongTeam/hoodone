import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '../utils/chakra/providers';
import Navibar from '../components/naviBar/navibar';
import RecoilRootWrapper from '@/utils/recoil/recoildWrapper';
import Sidebar from '@/components/sidebar/Sidebar';
import { Box, HStack, Portal } from '@chakra-ui/react';

/*TODO
- <Providers>에 의해, <h1> ,<h2> 등 브라우저 기본 태그 스타일 리셋 설정 해결하기
*/

export const metadata: Metadata = {
    title: 'Hoodone',
    description: 'Website made by Hoodone AI who wants to understand humans',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const navibarH = { base: '60px', md: '80px', lg: '100px' };
    const sideBarMaxW = '320px';

    return (
        <html>
            <body>
                <RecoilRootWrapper>
                    <Providers>
                        <Box w="full" h="full">
                            <Portal>
                                <Box
                                    w="full"
                                    h={navibarH}
                                    position={'fixed'}
                                    top={0}
                                    left={0}
                                    overflow={'hidden'}
                                >
                                    <Navibar />
                                </Box>
                            </Portal>
                            <Box w="full" h="full" mt={navibarH}>
                                <HStack alignItems={'start'} spacing={0}>
                                    <Box
                                        w="30%"
                                        maxW={sideBarMaxW}
                                        h={{
                                            base: `calc(100vh - ${navibarH.base})`,
                                            md: `calc(100vh - ${navibarH.md})`,
                                            lg: `calc(100vh - ${navibarH.lg})`,
                                        }}
                                        display={{ base: 'none', lg: 'block' }}
                                        position={'fixed'}
                                        top={navibarH}
                                    >
                                        <Sidebar />
                                    </Box>
                                    <Box
                                        w="full"
                                        h="full"
                                        border="5px solid pink"
                                        ml={{ base: 0, lg: sideBarMaxW }}
                                        transition="margin-left 0.3s ease-in-out"
                                    >
                                        {children}
                                    </Box>
                                </HStack>
                            </Box>
                        </Box>
                    </Providers>
                </RecoilRootWrapper>
            </body>
        </html>
    );
}
