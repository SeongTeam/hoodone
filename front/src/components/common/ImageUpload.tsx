"use client";
import React, { useState, useRef } from "react";
import { Box, Button, Flex, Stack, Input, Image, VStack, Spacer, Text, baseTheme,  } from "@chakra-ui/react";
import { AttachmentIcon } from '@chakra-ui/icons';
import { customColors } from "@/utils/chakra/customColors";


/* <input type ="file"/> 
reference : https://github.com/chakra-ui/chakra-ui/issues/457

/*TODO
- fallback 이미지 정하기
*/

export enum ImageUploadVariant {
    Profile = "Profile",
    Post = "Post"
}

type ImageUploadProps = {
    img : File | null,
    setImg : React.Dispatch<React.SetStateAction<File | null>>,
    onInputImg : (event: React.ChangeEvent<HTMLInputElement>) => void,
    onDropImg : (event: React.DragEvent<HTMLDivElement>) => void
    variant? : ImageUploadVariant
}

const ImageUploadArea : React.FC<ImageUploadProps> = ({
    img,
    setImg,
    onInputImg,
    onDropImg,
    variant = ImageUploadVariant.Post
}) => {

    const inputBorderColor = customColors.shadeLavender[300];
    const inputRef = useRef<HTMLInputElement>(null);
    const imageSrc = img && URL.createObjectURL(img); 
    const [dnDAreaBg, setDnDAreaBg] = useState<string>(customColors.white[200]);
    const dragCounter = useRef<number>(0);
    const ImagRadious = variant === ImageUploadVariant.Profile ? "full" : "15px";
    const ImageFit = variant === ImageUploadVariant.Profile ? "cover" : "contain";
    const handleCancelUpload = () => {
        setImg(null);
    }

    const handleDrop = (event : React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        onDropImg(event);
        setDnDAreaBg(customColors.white[200]);
        dragCounter.current = 0;
    }
    const handleDragOver = (event : React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    }
      
    const handleDragEnter = (event : React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();

        dragCounter.current++;
        if(dragCounter.current === 1) {    
            setDnDAreaBg(customColors.shadeLavender[200]);
        }
        
    }

    const handleDragLeave = (event : React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        dragCounter.current--;
        if(dragCounter.current === 0) {
            setDnDAreaBg(customColors.white[200]);
        }
    }

    
    return (
        <Stack
        direction={{ base: "column", lg: "row" }}
        py="10px"
        px="20px"
        spacing={{base : "20px" ,lg : "40px" }}
        borderRadius="15px"
        border={`1px solid ${inputBorderColor}`}
        alignContent="center"
        align="center"

        >
        <Flex
            id = "DragAndDropArea"
            bg={dnDAreaBg}
            borderRadius="15px"
            border ={`1px dashed  ${customColors.gray[100]}`}
            width= {{ base : "180px",lg : "300px"}}
            height ={{ base : "150px",lg :"250px"}}
            alignContent="center"
            _hover = {{bg: customColors.shadeLavender[300]}}
            px= "20px"
            py= "10px"
            onClick={() => inputRef.current?.click()}
            cursor="pointer"
            justify={"center"}
            align="center"
            objectFit={"contain"}
            overflow={"hidden"}
            draggable={true}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
        >
            <Box
                id="DragAndDropAreaImage"
                display="flex"
                justifyContent="center"
                alignItems="center" 
                pointerEvents="none" 
                width="100%" 
                height="100%" 
                
                >
                { imageSrc ? 
                    <Image
                        alt = "Quest Thumbnail Image"
                        borderRadius={ImagRadious}
                        width="100%"
                        height= "100%"
                        fallbackSrc="https://via.placeholder.com/150"
                        objectFit={ImageFit}
                        src={imageSrc} 
                        
                        /> 
                :   <VStack 
                        alignContent="center" 
                        direction="column"
                        pointerEvents="none"
                    >
                        <AttachmentIcon boxSize={8} mb="4px" color="black" />
                        <Text
                            mt="4px"
                            noOfLines={2}
                            fontSize="18px"
                            color="black"
                            whiteSpace="pre-line"
                        >
                            Upload Media File *.jpeg, *.png
                        </Text>
                    </VStack>
                }
            </Box>
        </Flex>
        <Box
            alignContent="center">
            <Box
                width = {{ base : "180px",lg : "300px"}}
                display = {{ base : "none",  lg: "block" }}
            >
                <Text
                    mt="4px"
                    noOfLines={3}
                    fontSize="20px"
                    color="black"
                    whiteSpace="pre-line"
                >
                    Freely Upload Image file.
                    Not need to be related to your quest
                </Text>
            </Box>
            <Flex gap = "20px">
                <Input 
                type="file" 
                name="image" 
                accept="image/*"
                ref={inputRef}
                onChange={onInputImg}
                style={{display: 'none'}}
                
                />
                <Button
                    bg={customColors.purple[100]}
                    _hover={{ bg: customColors.purple[200] }}
                    borderRadius="8px"
                    fontSize="20px"
                    py="20px"
                    px="15px"
                    onClick={() => inputRef.current?.click()}
                >
                    Upload
                </Button>
                <Button
                    bg={ img ? customColors.red[100] : customColors.gray[200]}
                    _hover={{ bg: img ? customColors.red[200] : customColors.gray[200] }}
                    borderRadius="8px"
                    fontSize="20px"
                    py="20px"
                    px="15px"
                    disabled={!img}
                    onClick={handleCancelUpload}
                >
                    Cancel
                </Button>
            </Flex>
        </Box>
    </Stack>
    );
}

export default ImageUploadArea