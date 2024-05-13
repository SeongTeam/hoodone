import {
    Flex,
    Image,
  } from "@chakra-ui/react";
import React, { useRef } from "react";
import ImageInput from "./subComponent/imageInput";
  
  
  /* TODO
  - Image file Drag 업로드 로직 적용하기
    drap& drop 로직 구현
    motion library 사용 고려
    ref: https://codesandbox.io/p/sandbox/basic-image-upload-e0e6d?file=%2Fsrc%2FApp.tsx%3A103%2C16
  - Image file upload 파일 크기 제한하기
  - Image 종류 호환성 확인하기.(.png, .jpeg, .gif , .webp, .jpg etc) 
    */
  type ImageUploadProps = {
    selectedFile: File | null;
    onSelectedImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDroppedImage: (event: React.DragEvent<HTMLDivElement>) => void;
    imagePreview: string | null;
    setImagePreview: React.Dispatch<React.SetStateAction<string | null>>
    isHidden: boolean
  };
  
  const ImageUpload: React.FC<ImageUploadProps> = ({
    selectedFile,
    onSelectedImage,
    onDroppedImage,
    imagePreview,
    setImagePreview,
    isHidden
  }) => {
    const ButtonSize = { base: "20px" , md: "28px" , xl : "33px" };
    

    return (
      <Flex hidden={isHidden} direction="column" justify="center" align="center" width="100%" gap="20px">
        <Image 
          src = {imagePreview || "/hood1/defaultThumbnail.svg"}
          alt = {imagePreview ? "Selected Thumbnail" : "Default Thumbnail"}
          width = "300"
          height = "300"
        />
        <ImageInput 
          file = {selectedFile}
          handleFileChange={onSelectedImage}
          handleDroppedFile={onDroppedImage}
          setImagePreview={setImagePreview}
        />
      </Flex>
    );
  };
  export default ImageUpload;
  