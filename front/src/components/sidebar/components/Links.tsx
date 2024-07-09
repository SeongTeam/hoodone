/* eslint-disable */
"use client";
import React from "react";
// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue, Link } from "@chakra-ui/react";
import { RouteInterface } from "@/components/sidebar/SideBarRoute";
import NextLink from 'next/link'
import { usePathname } from "next/navigation";
import { customColors } from "@/utils/chakra/customColors";

type SideBarLinksType = {
    routes: RouteInterface[];
}

export function SidebarLinks({ routes } : SideBarLinksType) {
  //   Chakra color mode

  const purple100 = customColors.purple[100];
  const gray100 = customColors.gray[100]
  const shadeLavender = customColors.shadeLavender[300];
  let activeColor = useColorModeValue(purple100, "white");
  let inactiveColor = useColorModeValue(
    gray100,
    gray100
  );
  let textColor = useColorModeValue(gray100, "white");
  let bgColor = useColorModeValue(shadeLavender, "brand.400");


  // verifies if routeName is the one active (in browser input)
  const activeRoute = (route : string) => {
    const currentRoute = usePathname().toLowerCase();
    
    const currentRootRoute = '/'+ currentRoute.split("/")[1];

    

    return currentRootRoute === route.toLowerCase();
  };

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks : React.FC<RouteInterface[]>= (routes : RouteInterface[]) => {
    return routes.map((route, index) => {
      if (route.childenRoutes) {
        return (
          <>
            <Text
              fontSize={"md"}
              color={activeColor}
              fontWeight='bold'
              mx='auto'
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              pt='18px'
              pb='12px'
              key={index}>
              {route.name}
            </Text>
            {createLinks(route.childenRoutes)}
          </>
        );
      } else {
        return (
          <Link key={index} as={NextLink} href={route.path}>
            {route.icon ? (
              <Box>
                  <Flex 
                    w='100%' 
                    ps = "30px"
                    py = "10px"
                    bg = {activeRoute(route.path.toLowerCase()) ? bgColor : "transparent"}
                    alignItems='center' 
                    justifyContent='center'
                    borderRadius={"15px"}
                    >
                    <Box
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeColor
                          : textColor
                      }
                      me='20px'
                      mb='5px'
                      >
                      {route.icon}
                    </Box>
                    <Text
                      me='auto'
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeColor
                          : textColor
                      }
                      fontWeight={
                        activeRoute(route.path.toLowerCase())
                          ? "bold"
                          : "normal"
                      }>
                      {route.name}
                    </Text>
                  </Flex>

              </Box>
            ) : (
              <Box>
                <HStack
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                  }
                  py='10px'
                  ps='20px'
                  bg = {activeRoute(route.path.toLowerCase()) ? bgColor : "transparent"}
                  >
                  <Text
                    me='auto'
                    color={
                      activeRoute(route.path.toLowerCase())
                        ? activeColor
                        : inactiveColor
                    }
                    fontWeight={
                      activeRoute(route.path.toLowerCase()) ? "bold" : "normal"
                    }>
                    {route.name}
                  </Text>
                </HStack>
              </Box>
            )}
          </Link>
        );
      }
    });
  };
  //  BRAND
  return createLinks(routes);
}

export default SidebarLinks;
