import React from "react";
import { Box, Grid, GridItem, Text, border } from "@chakra-ui/react";
import CreationRulesBox from "@/components/posts/create/postFormat/subComponent/creationRulesBox";

export default function CreateSBLayout({ children }: { children: React.ReactNode }) {


    return (
        <Box ml= "5px" >
            
            <Grid
                templateAreas={`"main leftSidebar"`}
                h="full"
                w="full"
            >
                <GridItem area={'main'}>
                    <Box
                            mb = "20px"
                            display={{base: "block", lg: "none"}}
                        >
                            <CreationRulesBox isQuestPost={false}></CreationRulesBox>
                    </Box>
                    <Text size="17px">User Submission</Text>
                    {children}
                </GridItem>
                <GridItem 
                    maxW ="400px"
                    area={'leftSidebar'}
                    pl="20px"
                    display={{base: "none", lg: "block"}}
                    border={"3px solid green"}
                >
                    <CreationRulesBox isQuestPost={false}></CreationRulesBox>
                </GridItem>
            </Grid>
        </Box>
    );
}