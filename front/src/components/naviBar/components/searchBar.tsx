import React from 'react';
import {
    Box,
    Flex,
    Image,
    InputGroup,
    InputLeftElement,
    Input,
    IconButton,
} from '@chakra-ui/react';
import { customColors } from '@/utils/chakra/customColors';
import { Icon } from '@iconify-icon/react';

type SearchInputProps = {
    user?: Object | null;
};

const SearchBar: React.FC<SearchInputProps> = ({ user }) => {
    const bg = customColors.white[200];
    const black = customColors.black[100];
    const gray = customColors.gray[100];

    return (
        <Box h='100%' w='full' px = '20px' maxW = "350px" >
            <InputGroup size = {{base : "sm" ,  lg: "md"}} bg={bg}
                color = {black}
                borderRadius="20px" 
             >
                <InputLeftElement>          
                        <IconButton 
                            bg='inherit'
                            borderRadius='inherit'
                            border = "none"
                            _hover ={{bg: "inherit", transform: "none"}}
                            _active={{
                                bg: "inherit",
                                transform: "none",
                            }}
                            _focus={{
                                boxShadow: "none",
                            }}
                            aria-label="Search"
                            pb = "10px"
                            color = {customColors.gray[100]}
                            icon = {<Icon icon ="iconamoon:search-light" width="24px" height="24px"/>}
                            onClick={() => alert ("Searh functionality is not implemented yet.")}
                        />
                </InputLeftElement>
                <Input
                    placeholder = " Search for quests and more"
                    _placeholder={{color: gray, fontSize: {base : "12px" ,  lg: "16px"}}}
                    border= "1px solid transparent"
                    _focus= {{border: '1px solid gray', boxShadow: 'none'}}
                    _hover={{border: '1px solid gray'}}
                    sx={{caretColor : black,
                        '&:focus:hover' : {
                            border: '1px solid gray',
                            boxShadow: 'none',
                        }
                    }}
                    />
                
            </InputGroup>
        </Box>
    );
};
export default SearchBar;
