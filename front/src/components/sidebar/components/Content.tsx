// chakra imports
"use client";
import { Box, Flex, Stack, Spacer, Text } from "@chakra-ui/react";
//   Custom components
import Links from "@/components/sidebar/components/Links";
import React from "react";
import { RouteInterface } from "@/components/sidebar/Sidebar";
import Panel from "./Panel";

// FUNCTIONS

type sidebarContentProps = {
    routes : RouteInterface[]
}

function SidebarContent({ routes } : sidebarContentProps)  {
  // SIDEBAR
  return (
    <Flex direction='column' height='100%' pt='25px' px="10px" borderRadius='30px' >
      <Stack direction='column' mt='5px' >
        <Box >
          <Links routes={routes} />
        </Box>
      </Stack>
      <Spacer/>
      <Box
        mt='60px'
        mb='40px'
        >
          <Panel/>
      </Box>
    </Flex>
  );
}

export default SidebarContent;
