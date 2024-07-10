"use client";
import { CldImage } from "next-cloudinary";
import { Box  } from "@chakra-ui/react";
import { cloudinaryTempData } from "@/utils/cloudinary/mockUpData";

type ProfileImageProps = {
    publicId : string
    radiusByPXunit : number
}

export const ProfileImage : React.FC<ProfileImageProps> = (
    { publicId, radiusByPXunit  } 
) => {
    return (
        <Box 
            borderRadius={'full'} 
            w={`${radiusByPXunit}px`} 
            h={`${radiusByPXunit}px`} 
            overflow={'hidden'} 
            position= { 'relative'}>
        <CldImage
            alt=' Ower profile image'
            src={publicId ?  publicId : cloudinaryTempData.defaultProfilePublicId }                     
            fill={true}
        />
    </Box>
    );
}