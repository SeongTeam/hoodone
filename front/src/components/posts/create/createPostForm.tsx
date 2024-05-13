import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { type PostType} from "@/atoms/post";
import useSelectFile from "@/hooks/useSelectFile";
import ImageUpload from "./postFormat/imageUpload";
import TextInput from "./postFormat/textInput";
import { userAccountState } from "@/atoms/userAccount";
import { customColors } from "@/utils/chakra/customColors";
import Tab , { type TabItem } from "./tab";
import { createPosts } from "@/app/server-actions/postsActions";



  type CreatePostFormProps = {
    userAccount: userAccountState;
    communityImageURL?: string;
  };
  
  const formTabs = [
    {
      ID: "Post",
    },
    {
      ID: "Thumbnail",
    },
  ];
    
  const CreatePostForm: React.FC<CreatePostFormProps> = ({
    userAccount,
  }) => {
    const [selectedTab, setSelectTab] = useState(formTabs[0].ID);
    const [newPost, setNewPost] = useState<PostType>({ title: '', content: '' } as PostType);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const { selectedFile , onSelectedFile, onDroppedFile } = useSelectFile();
    const [error, setError] = useState(false);
    const bg = customColors.black[300];
  
  
  
  
    const formTabsList= formTabs.map((item, index, array) =>{
      let borderWidth = "0px 1px 1px 0px"
      
    if(index === array.length - 1){
        borderWidth = "0px 0px 1px 0px"
      }
  
      return (<Tab
        key={item.ID}
        item={item}
        selected={item.ID === selectedTab}
        setSelectTab={setSelectTab}
        borderWidth = {borderWidth}
      />)
    });
  
  
    return (
      <Flex direction="column" 
        bg={bg} 
        borderRadius="15px" 
        border ={`1px solid ${customColors.strokeColor[100]}`}
      >
        <Flex width="100%">
          {formTabsList}
        </Flex>
        <Flex p="40px">
          <form action={createPosts}>
              <TextInput
                isHidden= {selectedTab !== "Post"}
                title={newPost.title}
                content={newPost.content}
                setTitle={(value : string)=>{ setNewPost( prev => ({ ...prev, title: value })); }}
                setContent={(value : string) =>{ setNewPost( prev => ({ ...prev, content: value })); }}
              />
              <ImageUpload
                isHidden= {selectedTab !== "Thumbnail"}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
                selectedFile={selectedFile as File}
                onSelectedImage={(event) => {
                  onSelectedFile(event);
                }}
                onDroppedImage={onDroppedFile}
              />
            <Button type="submit" variant="ouath" hidden={selectedTab !== "Post"}>
              Create
            </Button>
          </form>
        </Flex>
        {error && (
          <Alert status="error">
            <AlertIcon />
            <Text mr={2}>Error Creating Post</Text>
          </Alert>
        )}
      </Flex>
    );
  };
  export default CreatePostForm;
  