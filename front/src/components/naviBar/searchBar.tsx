import React from 'react';
import {
    Flex,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
} from '@chakra-ui/react';
import { customColors } from '@/utils/chakra/customColors';

type SearchInputProps = {
    user?: Object | null;
};

const SearchBar: React.FC<SearchInputProps> = ({ user }) => {
    const bg = customColors.black[200];
    const white = customColors.white[100];

    return (
        <Flex flexGrow={1} maxWidth="auto" align="center" ml="80px">
            <InputGroup alignContent={'center'} size="lg">
                <InputLeftElement pointerEvents="none">
                    <Image
                        src="/hood1/searchIcon.svg"
                        w={{ md: '20px', xl: '50px' }}
                        h={{ md: '10px', xl: '30px' }}
                        alt="search icon for searching post"
                    />
                </InputLeftElement>
                <Input
                    type="text"
                    fontSize={{ md: '10px', xl: '20px' }}
                    borderColor="transparent"
                    bg={bg}
                    color={white}
                />
            </InputGroup>
        </Flex>
    );
};
export default SearchBar;
