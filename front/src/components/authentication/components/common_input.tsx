import { Button, Box, Flex, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';
import { tree } from 'next/dist/build/templates/app-page';
import React from 'react';
import { MouseEventHandler } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

/*TODO
- form.register란?
*/
type CommonInputProps = {
    inputName: string;
    inputType: React.HTMLInputTypeAttribute | undefined;
    inputPlaceHolder?: string;
    isDisabled?: boolean;
    isUsedPasswordButton?: boolean;
    formData?: UseFormRegisterReturn;
};

export const CommonInput: React.FC<CommonInputProps> = (props: CommonInputProps) => {
    const { inputName, inputType, inputPlaceHolder, formData } = props;

    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);
    return (
        <Box w="full">
            <Text 
                paddingBottom={1} 
                fontFamily="Lato" 
                fontWeight={'bold'} 
                color="black"  
                fontSize="16px"
            >
                {inputName}
            </Text>
            {props.isUsedPasswordButton == true ? (
                <InputGroup>
                    <Input
                        variant="oauth"
                        placeholder={inputPlaceHolder}
                        type={show ? 'text' : 'password'}
                        isDisabled={props.isDisabled ?? false}
                        {...formData}
                    />
                    <InputRightElement
                        w="80px"
                        h="full"
                    >
                        <Button
                            w="full"
                            variant= { !show ? 'purple' : 'outline' }
                            mx="10px"
                            
                            onClick={handleClick}
                        >
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            ) : (
                <Input
                    variant="oauth"
                    placeholder={inputPlaceHolder}
                    type={inputType}
                    isDisabled={props.isDisabled ?? false}
                    {...formData} // ex) {...form.register('email', { required: true })}
                />
            )}
        </Box>
    );
};
