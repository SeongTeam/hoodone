import {
    Flex,
    Icon,
    Image,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Switch,
    Text,
    useColorMode,
} from '@chakra-ui/react';
import React from 'react';

import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { useUserAccountWithSSR  } from "@/hooks/userAccount";
import { defaultUserAccount } from '@/atoms/userAccount';
import { customColors } from '@/utils/chakra/customColors';
import { signOut } from '@/server-actions/AuthAction';

const UserMenu: React.FC = () => {
    const [user, setUser] = useUserAccountWithSSR();
    const router = useRouter();
    const textColor = customColors.white[100];
    const bg = customColors.black[200];
    const focusedColor = customColors.strokeColor[100];

    const handelNavigatePage = () => {
        if (user.isLogin) {
            alert('Route to My Page');
        }
    };

    const logout = async () => {
        await signOut();
        setUser(defaultUserAccount);
        router.push('/');
    };

    return (
        <Menu >
            <MenuButton
                cursor="pointer"
                borderRadius={4}
                _hover={{ outline: '1px solid', outlineColor: 'none' }}
            >
                <Flex align="center">
                    <Flex align="center">
                        <Image
                            src="/hood1/userIcon.svg"
                            alt="Icon Interface for showing user menulist"
                        />
                    </Flex>
                </Flex>
            </MenuButton>
            <MenuList mt="10px" bg={bg}>
                <MenuItem
                    fontSize="15px"
                    fontWeight="700"
                    closeOnSelect={false}
                    bg = {bg}
                    _hover={{ bg: 'blue.500', color: 'white' }}
                    _focus={{
                        bg: focusedColor,
                    }}
                >
                    <Flex gap={2} align="center" color={textColor}>
                        <Text>Notification</Text>
                    </Flex>
                </MenuItem>
                <MenuDivider />
                <MenuItem
                    fontSize="10px"
                    bg={bg}
                    _hover={{ bg: 'blue.500', color: 'white' }}
                    _focus={{
                        bg: focusedColor,
                    }}
                >
                    <Flex align="center" onClick={handelNavigatePage} color={textColor}>
                        Profile
                    </Flex>
                </MenuItem>
                <MenuDivider />
                <MenuItem
                    fontSize="10px"
                    fontWeight={700}
                    bg={bg}
                    _hover={{ bg: 'blue.500', color: 'white' }}
                    onClick={logout}
                    _focus={{
                        bg: focusedColor,
                    }}
                >
                    <Flex align="center" color="red.300">
                        Log Out
                    </Flex>
                </MenuItem>
            </MenuList>
        </Menu>
    );
};
export default UserMenu;
