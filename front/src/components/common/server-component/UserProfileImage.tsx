import React from "react";
import { Image } from "@chakra-ui/react";


type UserProfileImageProps = {
    ImageSrc : string
}

const UserProfileImage : React.FC<UserProfileImageProps> = ( { ImageSrc } ) => {

   
    const src = ImageSrc ? ImageSrc : '/hood1/defaultThumbnail.svg';
    

    return (
            <Image
            borderRadius="full"
            boxSize="30px"
            src={src}
            alt="Icon Interface for showing user menulist"
        />
    )
}

export default UserProfileImage