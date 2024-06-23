import {
    Box,
    Flex,
    Image,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Switch,
    Text,
    useColorMode,
    Portal
} from '@chakra-ui/react';
import React from 'react';
import { Icon } from '@iconify-icon/react';
import { useRouter } from 'next/navigation';
import { useUserAccountWithSSR  } from "@/hooks/userAccount";
import { defaultUserAccount } from '@/atoms/userAccount';
import { customColors } from '@/utils/chakra/customColors';
import { signOut } from '@/server-actions/AuthAction';
import UserMenuIcons from './UseMenuIcons'

const UserMenu: React.FC = () => {
    const [user, setUser] = useUserAccountWithSSR();
    const router = useRouter();
    const bg = customColors.white[100];
    const reactColor = customColors.purple[100];
    const ImageSrc = user.profileImg ? user.profileImg : '/hood1/defaultThumbnail.svg';
    const borderColor = customColors.shadeLavender[100];


    const handelNavigatePage = () => {
        if (user.isLogin) {
            alert('Route to Profile page');
        }
    };

    const logout = async () => {
        await signOut();
        setUser(defaultUserAccount);
        router.push('/');
    };

    /*TODO
    - Creation Ticket 개수 출력하기
    */
    return (
        <Box>
            <Flex gap = "10px" align={"center"}>
                <UserMenuIcons/>
                <Menu>
                    <MenuButton
                        cursor="pointer"
                        borderRadius="full"
                        h = "full"
                        w= "full"
                        _focus = {{ outline: 'none' }}
                    >
                        <Flex align="center">
                                <Image
                                    borderRadius="full"
                                    boxSize="30px"
                                    src={ImageSrc}
                                    alt="Icon Interface for showing user menulist"
                                />
                        </Flex>
                    </MenuButton>
                    <Portal>
                    <MenuList  border='1px soild' borderColor={borderColor} bg={bg} sx= {{ zIndex: 100 }}>
                    <MenuItem
                            fontSize = "16px"
                            cursor={"text"}
                            bg = "inherit"
                            disabled
                        >
                            <Flex gap= "15px" fontStyle={"italic"} align="center" color={customColors.gray[100]}>
                                <Text>Creation Tickets : null</Text>
                            </Flex>
                        </MenuItem>
                        <MenuDivider/>
                        <MenuItem
                            fontSize="14px"
                            bg = "inherit"
                            _hover={{ bg: customColors.shadeLavender[300], color : reactColor }}
                            _focus = {{ bg : "none"}}
                            color={customColors.gray[100]}
                            onClick={handelNavigatePage}
                        >
                            <Flex gap= "15px" align="center" >
                                <Icon style={{position: 'relative', top: '-4px'} } icon="iconamoon:profile-bold" width="20px" height="20px" />
                                <Text>Profile</Text>
                            </Flex>
                        </MenuItem>
                        <MenuDivider />
                        <MenuItem
                            fontSize="14px"
                            bg = "inherit"
                            _hover={{ bg: customColors.shadeLavender[300], color :reactColor }}
                            _focus = {{ bg : "none"}}
                            color={customColors.gray[100]}
                            onClick={logout}
                        >
                            <Flex gap= "15px" alignItems={"start"}>
                                <Icon icon="ic:twotone-logout" width="20px" height="20px" />
                                <Text align="center">
                                    Log Out
                                </Text>
                            </Flex>
                        </MenuItem>
                    </MenuList>
                    </Portal>
                </Menu>
            </Flex>
        </Box>
    );
};
export default UserMenu;
