// chakra imports
"use client";
import { Box, Flex, Stack, Spacer, Text } from "@chakra-ui/react";
//   Custom components
import Links from "@/components/sidebar/components/Links";
import React from "react";
import { RouteInterface } from "@/components/sidebar/SideBarRoute";
import Panel from "./Panel";
import { customColors } from "@/utils/chakra/customColors";

// FUNCTIONS

type ContentProps = {
    routes : RouteInterface[]
}

function Content({ routes } : ContentProps)  {
  // SIDEBAR
  return (
    <Box  pt='10px' px="10px"  h="100%" >
      <Flex direction='column' h="full">
        <Stack direction='column' mt='20px' >
          <Box >
            <Box mb ='10px'>
              <Text fontFamily={'Lato'} fontSize = "14px" color = { customColors.gray[100]}> 
              Page
              </Text>
            </Box >
            <Links routes={routes} />
          </Box>
        </Stack>
        <Spacer/>
        <Panel/>
      </Flex>
      </Box>
  );
}

export default Content;
