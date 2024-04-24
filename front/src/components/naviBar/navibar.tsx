'use client'

import { Providers } from "@/utils/chakra/providers";
import { 
    Button, 
    Flex,
    Image,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import SearchBar from "./searchBar";
import { UserAccountState } from "@/atoms/userAccount";
import { useRecoilState } from "recoil";
import RightContent from "./rightContent/rightContent";

export default function NaviBar() {

    const bg = "red";
    const fontSize = "2xl";
    const color = "gray.500";
    const router = useRouter();
    const rootRoute= "/";

    return (

        <Flex 
            bg={color}
            justify="space-between"
            h="84px"
            w="full"
        >
            <Flex
                align="center"
                cursor="pointer"
            >
                <Image 
                src="/hood1/sideNavIcon.svg" 
                w={{ base: "30px" ,xl : "70px"}}
                h={{ base: "30px" ,xl : "70px"}} 
                alt="Icon of Side Navi bar"
                />
            </Flex>
            <Flex
                align="center"
                width={{ base: "40px", md: "auto" }}
                ml={{ base: 0, md: 10 , xl : "40px"}}
                cursor="pointer"
                onClick={() => {
                    router.push(rootRoute);
                }}
            >
                <Image 
                    src="/hood1/homeIcon.svg" 
                    w={{ base: "30px" ,xl : "70px"}}
                    height={{ base: "30px" ,xl : "60px"}}
                    alt="Icon of Hood 1"/>
                <Image
                    src="/hood1/hood1Text.svg"
                    w={{ md: "70px" ,xl : "140px"}}
                    height={{ md: "25px" ,xl : "50px"}}
                    display={{ base: "none", md: "unset" }}
                    alt="Text Image of Hood 1"  
                />
            </Flex>
            <SearchBar/>
            <RightContent/>
        </Flex>

        
    );
} 
