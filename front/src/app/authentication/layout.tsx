import { Box } from "@chakra-ui/react";
import { customColors } from "@/utils/chakra/customColors";

/* TODO
- base breakpoint일때, 해당 레이아웃위치를 가운대로 옮기기
*/
export default function AuthenticationLayout({ children }: { children: React.ReactNode }) {
    
    const bg = customColors.white[100];
    
    return (
        <Box 
            w={{base : "80%" , lg : "720px"}} 
            h="830px"
            borderRadius={"15px"}
            mt = "40px"
            ms = {{ base : "0px" , lg : "20px" }}
            bg={bg}
            px = {{ base : "20px" , lg : "140px" }}
            py = {{ base : "40px" , lg : "90px" }}
            border="3px solid blue"
        >
            {children}
        </Box>
    );
}