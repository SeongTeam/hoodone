"use client";
import { Button, Box ,Flex, Image,Spacer ,Text } from '@chakra-ui/react';
import SearchBar from './components/searchBar';
import { customColors } from '@/utils/chakra/customColors';
import { useUserAccountWithSSR } from "@/hooks/userAccount";
import LoginButton from './components/LoginButton';
import UserMenu from './components/UserMenu';

export default function NaviBar() {
    const bg = customColors.white[100];
    const [user, setUser] = useUserAccountWithSSR();

    const gretting = user.isLogin ? `Hello, ${user.nickname}!` : 'Hello, Visistor!';


    return (
        <Box h='100%' w='100%' px = '20px' bg={bg} 
            alignContent={'center'}
         border = '3px solid red'>
            <Flex >
                <Box display = { {base : "none",  lg: "block" }}w = "25%" 
                border = "3px solid pink">
                    <Text fontFamily={'Lato'} fontSize = "24px"> Small Quest</Text>
                </Box>
                <Box w = "25%" alignContent={'center'} 
                border = "3px solid pink">
                    <Text fontSize = {{base : "16px" ,  lg: "20px"}}> {gretting}</Text>
                </Box>
                <Spacer />
                <SearchBar />
                { user.isLogin ? <UserMenu /> : <LoginButton /> }
            </Flex>

        </Box>
    );
}
