'use client';
import React from "react";

import {
  Box,
  Flex,
  Drawer,
  DrawerBody,
  useColorModeValue,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import Content from "@/components/sidebar/components/Content";
import {
  renderThumb,
  renderTrack,
  renderView,
} from "@/components/scrollbar/Scrollbar";
import { customColors } from "@/utils/chakra/customColors";
import { usePathname } from "next/navigation";
import { Icon } from '@iconify-icon/react'

// FUNCTIONS

/*TODO
- <Scorllbars/> 이해하기
*/
function Sidebar() {

  const routes = getRoutes();
  let variantChange = "0.2s linear";
  // Chakra Color Mode
  let sidebarBg = useColorModeValue(customColors.white[100], "navy.800");

  // SIDEBAR
  return (
    <Box display={{base : "none",  lg: "block" }} w="100%" minH='100%' 
    height = "100%">
      <Box
        bg={sidebarBg}
        transition={variantChange}
        h= '85vh'
        minH='100%'
        overflowX='hidden'
        >
          <Content routes={routes} />
      </Box>
    </Box>
  );
}

// FUNCTIONS
export function SidebarResponsive() {
  /*
  let sidebarBackgroundColor = useColorModeValue("white", "navy.800");
  let menuColor = useColorModeValue("gray.400", "white");
  // // SIDEBAR
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  // let isWindows = navigator.platform.startsWith("Win");
  //  BRAND

  return (
    <Flex display={{ sm: "flex", xl: "none" }} alignItems='center'>
      <Flex ref={btnRef} w='max-content' h='max-content' onClick={onOpen}>
        <Icon
          as={IoMenuOutline}
          color={menuColor}
          my='auto'
          w='20px'
          h='20px'
          me='10px'
          _hover={{ cursor: "pointer" }}
        />
      </Flex>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={document.documentElement.dir === "rtl" ? "right" : "left"}
        finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent w='285px' maxW='285px' bg={sidebarBackgroundColor}>
          <DrawerCloseButton
            zIndex='3'
            onClose={onClose}
            _focus={{ boxShadow: "none" }}
            _hover={{ boxShadow: "none" }}
          />
          <DrawerBody maxW='285px' px='0rem' pb='0'>
            <Scrollbars
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}>
              <Content routes={routes} />
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
  */
}
// PROPS



export default Sidebar;

export interface RouteInterface {
  name: string;
  path: string;
  icon: React.ReactNode;
  childenRoutes? : RouteInterface[];
}


/*TODO
- Icon load delay를 없애기 위해, 직접 아이콘 리소스를 생성하여 public 폴더에 넣기
*/
function getRoutes() : RouteInterface[] {
  const defaultRoutes : RouteInterface[] = [
    {
        name: 'home',
        path: '/',
        icon: <Icon icon="iconamoon:home-fill" width="24px" height="24px"/>,
    },
    {
        name: 'quest',
        path: '/quest',
        icon: <Icon icon="arcticons:block-blast-adventure-master" width="26px" height="26px"/>,
    },
    {
        name: 'submissions',
        path: '/submissions',
        icon: <Icon icon="carbon:certificate-check" width="24px" height="24px"/>,
    },
];

const authRoutes : RouteInterface[] = [
    {
        name: 'Sign in',
        path: '/auth/sign-in',
        icon: null,
    },
    {
        name: 'Sign Up',
        path: '/auth/sign-up',
        icon: null,
    },
    {
        name: 'Reset Password',
        path: '/auth/reset-password',
        icon: null,
    }, 
];

const profileRoutes : RouteInterface[] = [
    {
        name: 'Favorite Quests',
        path: '/profile/favorite-quests',
        icon: null,
    },
    {
        name: 'user quests',
        path: '/profile/quests',
        icon: null,
    },
    {
        name: 'user submissions',
        path: '/profile/submissions',
        icon: null,
    },
    {
      name: 'Profile settings',
      path: '/profile',
      icon: null,
  },
];

  const currentRoute = usePathname().toLowerCase();
  const rootSegment = currentRoute.split("/") [1];

  switch (rootSegment) {
    case "auth":
      return authRoutes;
    case "profile":
      return profileRoutes;
    default:
      return defaultRoutes;
  }

  return defaultRoutes;
  
}