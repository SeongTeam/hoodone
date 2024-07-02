import React from 'react';
import { Image } from '@chakra-ui/react';

type UserProfileImageProps = {
    ImageSrc: string;
    boxSize?: string;
};

const UserProfileImage: React.FC<UserProfileImageProps> = ({ ImageSrc, boxSize }) => {
    const src = ImageSrc ? ImageSrc : '/hood1/defaultThumbnail.svg';

    return (
        <Image
            borderRadius="full"
            boxSize={boxSize ?? '30px'}
            src={src}
            alt="Icon Interface for showing user menulist"
        />
    );
};

export default UserProfileImage;
