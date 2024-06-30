'use client';

import { PostType } from '@/atoms/post';
import MiniPostCard from '@/components/posts/card/MiniPostCard';
import { customColors } from '@/utils/chakra/customColors';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { Button, Flex, HStack } from '@chakra-ui/react';
import React from 'react';

const mockPost: PostType = {
    id: 1,
    createdAt: Date.prototype,
    updatedAt: Date.prototype,
    deletedAt: null,
    title: 'test123456789123456789',
    content:
        ' Today was a productive day for me as a backend developer. I started my day by reviewing the code I wrote yesterday for the new authentication system. I made sure that it was clean, efficient, and secure. I also added some unit tests to ensure that the code was working as expected.',
    // cloudinaryPublicId: null,
    tags: ['mock', 'dev', 'hoodone'],
    favoriteCount: 15,
    isPublished: true,
    boardId: 1,
    author: { nickname: 'mock', profileImagePublicId: '1' },
    comments: [],
};
const mockPostData1: PostType[] = [
    mockPost,
    mockPost,
    mockPost,
    mockPost,
    mockPost,
    mockPost,
    mockPost,
];
const mockPostData2: PostType[] = [mockPost, mockPost, mockPost];

export class PostSlider extends React.Component {
    public static async getInitialProps({ res, req, asPath, query }: any) {
        //  SSR 처리가 일어나는 부분

        return {
            // 렌더링 함수로 보낼 props 데이터 처리 부분
        };
    }

    _slideLeft() {
        let slider = document.getElementById('slider')!;
        slider.scrollLeft = slider.scrollLeft - 235;
    }

    _slideRight() {
        let slider = document.getElementById('slider')!;
        slider.scrollLeft = slider.scrollLeft + 235;
    }
    render() {
        return (
            <HStack w="100%" overflowY="hidden" overflowX="scroll">
                <Button
                    title="scroll left"
                    w="60px"
                    h="60px "
                    bg={customColors.purple[100]}
                    onClick={this._slideLeft}
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
                    {mockPostData1.map((post, index) => (
                        <MiniPostCard key={index} index={index} post={post} />
                    ))}
                </Flex>
                <Button
                    title="scroll right"
                    w="60px"
                    h="60px "
                    bg={customColors.purple[100]}
                    onClick={this._slideRight}
                >
                    <ArrowRightIcon />
                </Button>
            </HStack>
        );
    }
}
