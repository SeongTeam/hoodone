import { CldImage } from "next-cloudinary";
import { Box,Image } from '@chakra-ui/react';

type props = {
    publicID: string | undefined;
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
const PostThumbnail: React.FC<props> = ({ publicID }) => {
    const minLength = 1;
    return(
    <Box 
        position = "relative" // essential for <CldImage/> fill props
        width="auto" 
        h="200" bg ="black" 
        borderRadius="15px"
        _hover={{ border : "1px solid white" }}
        >
            {publicID&&publicID.length > minLength ? 
            <CldImage 
                fill
                src={publicID}
                alt="thumbnail"
                sizes= "10vw"
                priority
                /> 
            : 
            <Image
                w="full"
                h="full" 
                src="https://res.cloudinary.com/dk5ug4mzv/image/upload/v1714549154/hoodone/h4tpikvcyqntfuqqhby6.jpg" alt="default thumbnail" />
            }
     </Box>
    );
};

export default PostThumbnail;
