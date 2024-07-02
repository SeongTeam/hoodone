'use client';

import { PostType } from '@/atoms/post';
import AdminPostCard from '@/components/posts/card/AdminPostCard';
import MiniPostCard from '@/components/posts/card/MiniPostCard';
import PostCard from '@/components/posts/card/PostCard';
import { customColors } from '@/utils/chakra/customColors';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import { Icon } from '@iconify-icon/react';

import React from 'react';

interface PostSliderPops {
    sliderName: string;
    gap?: string;
    children: React.ReactNode;
}

const PostSlider: React.FC<PostSliderPops> = ({ sliderName, gap, children }) => {
    const BTN_H = 70;
    const BTN_W = 40;

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
        <Box position="relative" px="15px">
            <Button
                style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translate(-50%, -50%)', // Center both horizontally and vertically
                    left: -1,
                    width: BTN_W,
                    height: BTN_H,
                    backgroundColor: customColors.purple[100],
                }}
                title="scroll left"
                bg={customColors.purple[100]}
                onClick={_slideLeft}
            >
                <ArrowLeftIcon />
            </Button>
            <HStack w="100%" overflowY="hidden" overflowX="scroll">
                <Flex
                    w="1400px"
                    id="slider"
                    overflowY="hidden"
                    overflowX="scroll"
                    scrollBehavior="smooth"
                    gap={gap ?? '2.2rem'}
                >
                    {children}
                </Flex>
            </HStack>
            <Button
                style={{
                    position: 'absolute',
                    top: '50%',
                    transform: 'translate(50%, -50%)', // Center both horizontally and vertically
                    right: -1,
                    width: BTN_W,
                    height: BTN_H,
                    backgroundColor: customColors.purple[100],
                    display: 'flex', // Ensure UpBtn has available space for centering
                }}
                title="scroll left"
                bg={customColors.purple[100]}
                onClick={_slideRight}
            >
                <ArrowRightIcon />
            </Button>
        </Box>
    );
};

export default PostSlider;
