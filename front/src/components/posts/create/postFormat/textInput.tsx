import React from "react";
import {
  Button,
  Flex,
  Input,
  Stack,
} from "@chakra-ui/react";
import TextEditor from "./subComponent/textEditor";
import { customColors } from "@/utils/chakra/customColors";

/* TODO
- Input 스타일 css 파일로 적용하기
*/

type TextInputProps = {
  title : string;
  content : string;
  setTitle: ( value: string ) => void;
  setContent : ( value: string ) => void;
  isHidden : boolean;
};

const TextInput: React.FC<TextInputProps> = ({
  title = '',
  content = '',
  setTitle,
  setContent,
  isHidden,
}) => {
  const bg = customColors.black[300];

  const handleEditorChange = (value: string) => {
    setContent(value);
  }

  return (
    <Stack hidden = {isHidden} spacing={3} width="100%">
      
      <Input
        variant="newPost"
        name="inputUrl"
        placeholder="Linked URL (optional)"
        _placeholder={{ color: "gray.500" }}
        bg = {bg}
      />
      <Input
        variant="newPost"
        name="title"
        value={title}
        onChange={(e) =>setTitle(e.target.value)}
        placeholder="Title"
        _placeholder={{ color: "gray.500" }}
        bg = {bg}
      />
      <TextEditor onChange={handleEditorChange} body={content}/>
      <Input hidden={true} name="content" value={content}></Input>
    </Stack>
  );
};
export default TextInput;
