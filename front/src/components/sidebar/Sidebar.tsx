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
  Text,
} from "@chakra-ui/react";
import Content from "@/components/sidebar/components/Content";
import { customColors } from "@/utils/chakra/customColors";
import { usePathname } from "next/navigation";
import { Icon } from '@iconify-icon/react'
import { getRoutes } from "./SideBarRoute";

// FUNCTIONS

/*TODO
- <Scorllbars/> 이해하기
*/
function Sidebar() {

  const currentRoute = usePathname();
  const routes = getRoutes(currentRoute);
  let variantChange = "0.2s linear";
  // Chakra Color Mode
  let sidebarBg = useColorModeValue(customColors.white[100], "navy.800");

  // SIDEBAR
  return (
    <Box display={{base : "none",  lg: "block" }} h="full" w="100%" minH='100%'  border={"1px solid yellow"}>
      <Box
        bg={sidebarBg}
        transition={variantChange}
        h="full"
        minH='100%'
        overflowX='hidden'
        >
        <Content routes={routes} />
      </Box>
    </Box>
  );
}

export default Sidebar;




