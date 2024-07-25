import { CldImage } from "next-cloudinary";
import { Box,Image } from '@chakra-ui/react';
import { cloudinaryTempData } from "@/utils/cloudinary/mockUpData";

type props = {
    publicID: string ;
    heightPX? : number ;
};

/*TODO
- cloudinary storage 이미지 업로드 접근 방식 고려
    - Chakra UI <Image/> 사용
    1. public id
    2. url
    - cloudinary <cldImage/> 사용

- Place Holder 적용
ref : https://next.cloudinary.dev/guides/responsive-images
*/

//CldImage ref : https://next.cloudinary.dev/cldimage/basic-usage
const PostThumbnail: React.FC<props> = ({ publicID, heightPX }) => {
    
    return(
    <Box 
        position = "relative" // essential for <CldImage/> fill props
        width="100%" 
        h={heightPX ? `${heightPX}px` : "200px"}
        _hover={{ border : "1px solid white" }}
        >
            <CldImage 
                fill
                src={publicID}
                alt="thumbnail"
                sizes= "10vw"
                style={{ objectFit: "cover", borderRadius: "15px" }}
                priority
                /> 
     </Box>
    );
};

export default PostThumbnail;
