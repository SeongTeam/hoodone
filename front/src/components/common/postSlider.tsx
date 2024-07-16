'use client';

import AdminPostCard from '@/components/posts/card/AdminPostCard';
import MiniPostCard from '@/components/posts/card/MiniPostCard';
import PostCard from '@/components/posts/card/PostCard';
import { customColors } from '@/utils/chakra/customColors';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import { Icon } from '@iconify-icon/react';

import React, { useEffect, useRef, useState } from 'react';

interface PostSliderPops {
    sliderName: string;
    gap?: string;
    width?: string;
    hight?: string;
    children: React.ReactNode;
}

const PostSlider: React.FC<PostSliderPops> = ({ sliderName, gap, children, width, hight }) => {
    const BTN_H = 70;
    const BTN_W = 40;
    const elementName = `Slider-${sliderName}`
    const sliderRef = useRef<HTMLDivElement>(null);

    const _slideLeft = () => {
        if(sliderRef.current) {
            sliderRef.current.scrollLeft -= 235;
            
        }
    };

    const _slideRight = () => {
        if(sliderRef.current) {
            sliderRef.current.scrollLeft += 235;
            
        }
    };

    return (
        <Box position="relative" px="15px" w={width} h={hight}>
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
                    id={elementName}
                    ref={sliderRef}
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
