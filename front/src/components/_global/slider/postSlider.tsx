'use client';

import { PostType } from '@/atoms/post';
import AdminPostCard from '@/components/posts/card/AdminPostCard';
import MiniPostCard from '@/components/posts/card/MiniPostCard';
import PostCard from '@/components/posts/card/PostCard';
import { customColors } from '@/utils/chakra/customColors';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack } from '@chakra-ui/react';
import React from 'react';

type contentCardType = 'MiniPostCard' | 'PostCard' | 'AdminPostCard';

interface PostSliderPops {
    cardType: contentCardType;
    postData: PostType[];
    sliderName: string;
}

const PostSlider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const cardComponentMap = {
        MiniPostCard: MiniPostCard,
        PostCard: PostCard,
        AdminPostCard: AdminPostCard,
    };

    const _slideLeft = () => {
        let slider = document.getElementById('slider')!;
        slider.scrollLeft = slider.scrollLeft - 235;
    };

    const _slideRight = () => {
        let slider = document.getElementById('slider')!;
        slider.scrollLeft = slider.scrollLeft + 235;
    };

    return (
        <HStack w="100%" overflowY="hidden" overflowX="scroll">
            <Button
                title="scroll left"
                w="60px"
                h="60px "
                bg={customColors.purple[100]}
                onClick={_slideLeft}
            >
                <ArrowLeftIcon />
            </Button>

            <Flex
                id="slider"
                w="100%"
                overflowY="hidden"
                overflowX="scroll"
                scrollBehavior="smooth"
                gap="2.2rem"
            >
                {children}
            </Flex>
            <Button
                title="scroll right"
                w="60px"
                h="60px "
                bg={customColors.purple[100]}
                onClick={_slideRight}
            >
                <ArrowRightIcon />
            </Button>
        </HStack>
    );
};

export default PostSlider;
