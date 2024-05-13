import CldImage from "@/utils/cloudinary/cldImage";
import { Image } from "@chakra-ui/react";

type props = {
    publicID : string | undefined
}

/*TODO
- cloudinary storage 이미지 업로드 접근 방식 고려
    - Chakra UI <Image/> 사용
    1. public id
    2. url
    - cloudinary <cldImage/> 사용
*/

//CldImage ref : https://next.cloudinary.dev/cldimage/basic-usage
const PostThumbnail: React.FC<props> = ({publicID}) => {
    return (
        (publicID) ?
        (        <CldImage src={publicID} alt="thumbnail"/>
        ) : (
        <Image src="/hood1/defaultThumbnail.svg" alt="default thumbnail"/> 
        )  
    );
};

export default PostThumbnail