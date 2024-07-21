'use client';

import AdminPostCard from '@/components/posts/card/AdminPostCard';
import MiniPostCard from '@/components/posts/card/MiniPostCard';
import PostCard from '@/components/posts/card/PostCard';
import { customColors } from '@/utils/chakra/customColors';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, HStack } from '@chakra-ui/react';
import { Icon } from '@iconify-icon/react';

import React, { useEffect, useRef, useState } from 'react';

/*TODO
- 슬라이더 움직임을 좀더 정교하게 구현하기
   - ref: https://codesandbox.io/s/chakra-carousel-dd8vn?file=/src/ChakraCarousel.js:3592-3596
*/

interface PostSliderPops {
    sliderName: string;
    gap?: string;
    height?: string;
    children: React.ReactNode;
}

const PostSlider: React.FC<PostSliderPops> = ({ sliderName, gap, children, height }) => {
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
        <Box position="relative" px={`${BTN_W/2}px`}
            mx="10px"
            minH="80px"
            h={height}
            w={`calc(100%"-${BTN_W}px)`}
        >
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
            <Flex
                w="100%"
                id={elementName}
                ref={sliderRef}
                overflowX="scroll"
                scrollBehavior={"smooth"}
                gap={gap ?? '2.2rem'}
            >
                {children}
            </Flex>
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
                title="scroll right"
                bg={customColors.purple[100]}
                onClick={_slideRight}
            >
                <ArrowRightIcon />
            </Button>
        </Box>
    );
};

export default PostSlider;
