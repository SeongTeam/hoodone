import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@chakra-ui/react";
/* 
ref : https://www.obytes.com/blog/cloudinary-in-nextjs

*/
type ImageInputProps = {
    file : File | null,
    handleFileChange : ( e : ChangeEvent<HTMLInputElement> ) => void,
    handleDroppedFile : ( e : React.DragEvent<HTMLDivElement> ) => void,
    setImagePreview? : React.Dispatch<React.SetStateAction<string | null>>
}

/*TODO
- image upload 후, public ID 접근 방법 구현
    - public ID는 post 객체에 저장되어 관리된다.
- metadata 추가

*/
const ImageInput: React.FC<ImageInputProps> = ({
    file,
    handleFileChange,
    handleDroppedFile,
    setImagePreview,

}) => {

    const onSelectedFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("[event]", event);
        handleFileChange(event);
        if(setImagePreview){
          setImagePreview(URL.createObjectURL(event.target.files![0]));
        }
    }
    return (
        <div>
            
          <input type="file" name="image" onChange={onSelectedFile}/>
          {file ? file.name : "No file"}
        </div>

    );
}

export default ImageInput;
