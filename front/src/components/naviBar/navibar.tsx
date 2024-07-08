"use client";
import { Button, Box ,Flex, Image,Spacer ,Text,  } from '@chakra-ui/react';
import SearchBar from './components/searchBar';
import { customColors } from '@/utils/chakra/customColors';
import { useUserAccountWithSSR } from "@/hooks/userAccount";
import LoginButton from './components/LoginButton';
import UserMenu from './components/UserMenu';
import SidebarResponsive from '../sidebar/SideBarDrawer';
import { useRouter } from 'next/navigation';

export default function NaviBar() {
    const router = useRouter();
    const bg = customColors.white[100];
    const [userAccount] = useUserAccountWithSSR();

    const gretting = userAccount.isLogin ? `Hello, ${userAccount.nickname}!` : 'Hello, Visistor!';


    return (
        <Box h='100%' w='100%' px = '20px' bg={bg} 
            alignContent={'center'}
         border = '3px solid red'>
            <Flex alignContent={'center'} alignItems={'center'} >
                <SidebarResponsive />
                <Box  
                    alignContent={'center'} 
                    me= {{base : "0px" , lg: "150px"}}
                    onClick={() => router.push("/")}
                    cursor="pointer"
                    >
                    <Text 
                        fontFamily={'Lato'} 
                        fontWeight={'bold'} 
                        fontSize = {{md : "20px" ,  lg: "28px"}}
                    > 
                        Small Quest
                    </Text>
                </Box>
                <Box display = { {base : "none",  lg: "block" }} alignContent={'center'} 
                >
                    <Text fontSize = {{md : "12px" ,  lg: "20px"}}> {gretting}</Text>
                </Box>
                <Spacer />
                <SearchBar />
                { userAccount.isLogin ? <UserMenu /> : <LoginButton /> }
            </Flex>

        </Box>
    );
}
