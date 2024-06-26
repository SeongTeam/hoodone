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
<<<<<<< HEAD
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
=======
    titlePlaceHolder: string;
    contentPlaceHolder: string;
    tagPlaceHolder: string;

    title: string;
    content: string;
    tag: string;
    setTitle: (value: string) => void;
    setContent: (value: string) => void;
    setTag: (value: string) => void;
    isHidden: boolean;
};

const TextInput: React.FC<TextInputProps> = ({
    title = '',
    content = '',
    tag: tags = '',
    setTitle,
    setContent,
    setTag,

    isHidden,
    titlePlaceHolder,
    contentPlaceHolder,
    tagPlaceHolder: tagsPlaceHolder,
>>>>>>> dcbff04 (<feature> [front] tag 로직 추가)
}) => {
  const bg = customColors.black[300];

  const handleEditorChange = (value: string) => {
    setContent(value);
  }

<<<<<<< HEAD
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
=======
    const handleEditorChange = (value: string) => {
        setContent(value);
    };

    return (
        <Box>
            <VStack
                // bg="red"
                alignContent="space-between"
                direction="column"
                hidden={isHidden}
                spacing="20px"
                // width={breakpoints}
            >
                <Input
                    border={`1px solid ${inputBorderColor}`}
                    focusBorderColor={focusBorderColor}
                    borderRadius="8px"
                    color={fontColor}
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={titlePlaceHolder}
                    bg={bg}
                />

                <Textarea
                    border={`1px solid ${inputBorderColor}`}
                    focusBorderColor={focusBorderColor}
                    color={fontColor}
                    placeholder={contentPlaceHolder}
                    height="200px"
                    name="content"
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                ></Textarea>

                <Input
                    border={`1px solid ${inputBorderColor}`}
                    focusBorderColor={focusBorderColor}
                    borderRadius="8px"
                    color={fontColor}
                    name="tags"
                    value={tags}
                    /**TODO Tage onChange logic 추가하기 */
                    onChange={(e) => setTag(e.target.value)}
                    placeholder={tagsPlaceHolder}
                    bg={bg}
                />
            </VStack>
        </Box>
    );
>>>>>>> dcbff04 (<feature> [front] tag 로직 추가)
};
export default TextInput;
