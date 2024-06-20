import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '../utils/chakra/providers';
import Navibar from '../components/naviBar/navibar';
import RecoilRootWrapper from '@/utils/recoil/recoildWrapper';
import Sidebar from '@/components/sidebar/Sidebar';
import { Box , HStack } from '@chakra-ui/react';

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

    const navibarH = "10vh"

    return (
        <html>
            <body>
                <RecoilRootWrapper>
                    <Providers>
                        {/*TODO
                            <Box>를 사용하여 navibar와 SideBar 배치하여 layout 생성하기
                        */}
                        <Box w="full" h="full">
                            <Box w="full" h={navibarH} position={"fixed"} top={0} overflow={"hidden"}>
                                <Navibar />
                            </Box>
                            <Box  w="full" h="full" mt= {navibarH}>
                                <HStack alignItems={"start"} 
                                    border = "3px solid purple">                        
                                    <Box w= "25%" h="100%" position={"sticky"} top={navibarH}>
                                        <Sidebar /> 
                                    </Box>
                                    <Box w="75%" h="full"
                                        border = "5px solid pink">
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
