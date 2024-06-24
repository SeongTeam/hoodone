"use client";
import React , {useRef} from "react";
import { useDisclosure, } from "@chakra-ui/hooks";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Flex, Box, Button, Drawer, IconButton,DrawerFooter, DrawerOverlay,DrawerBody, DrawerContent, DrawerCloseButton } from "@chakra-ui/react";
import { Icon } from "@iconify-icon/react";
import { getRoutes } from "./SideBarRoute";
import { usePathname } from "next/navigation";
import { customColors } from "@/utils/chakra/customColors";
import Content from "./components/Content";

const SidebarResponsive : React.FC = () => {

    const currentPath = usePathname();
    const routes = getRoutes(currentPath);
    let sidebarBg = useColorModeValue(customColors.white[100], "navy.800");

    const btnRef = useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure();


  

  
    return (
        <>
            <IconButton
            bg="inherit"
            border="none"
            color={customColors.black[100]}
            display={{ base: "block", lg: "none" }}
            variant="outline"
            icon={<Icon icon="mdi:menu" width="24px" height="24px" />}
            aria-label="open sidebar"
            ref={btnRef}
            onClick={onOpen}
        >
    
            </IconButton>
            <Drawer
                isOpen = {isOpen}
                placement="left"
                onClose = {onClose}
                finalFocusRef={btnRef}
                
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerBody bg={sidebarBg}>
                            <Box h={"full"}>
                            <Content routes={routes} />
                            </Box>
                        </DrawerBody>
                    </DrawerContent>

            </Drawer>
      </>
    );
  }
  // PROPS

  export default SidebarResponsive;