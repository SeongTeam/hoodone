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
} from "@chakra-ui/react";
import React from "react";

import { useRouter } from "next/navigation";
import { UserAccountState } from "@/atoms/userAccount";
import { useRecoilState } from "recoil";

const UserMenu: React.FC = () => {
  const [user, setUser] = useRecoilState(UserAccountState);
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor="#FFFFFF";
  const bg="#1C1C1C";
  const focusedColor="gray.500";

  const handelNavigatePage = () => {
    if (user.isLogin) {
      alert("Route to My Page");
    }
  };

  const logout = async () => {
    /* TODO
    - user state 변화
    - cookie에 저장된 accessToken , refresh Token 제거
    */ 
  };

  return (
    <Menu>
      <MenuButton
        cursor="pointer"
        borderRadius={4}
        _hover={{ outline: "1px solid", outlineColor: "none" }}
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
          _hover={{ bg: "blue.500", color: "white" }}
          _focus = {{
            bg : focusedColor,
        }}
        >
          <Flex gap={2} align="center" color={textColor}>
            <Text>Notification</Text>
          </Flex>
        </MenuItem>
          <MenuDivider />
            <MenuItem
              fontSize="10px"
              _hover={{ bg: "blue.500", color: "white" }}
              _focus = {{
                bg : focusedColor,
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
            _hover={{ bg: "blue.500", color: "white" }}
            onClick={logout}
            _focus = {{
              bg : focusedColor,
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
