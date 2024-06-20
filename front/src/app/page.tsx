
import Link from "next/link";
import { Box, Flex, Spacer } from "@chakra-ui/react";
import { customColors } from "@/utils/chakra/customColors";
import CenterCard from "@/components/common/server-component/centerCard";


/* TODO
- style 적용 불가 원인 분석 및 해결
- Home page 디자인
  - NaviBar 디자인
  - Auth 로직 구현  
*/
export default function Home() {
  
  return (
    <>
      <main>
        <Box w="full" >
            <CenterCard/>
        </Box>
      </main>
    </>
  );

}
