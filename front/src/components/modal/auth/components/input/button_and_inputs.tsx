import { Button, Flex, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';
import React from 'react';
import { MouseEventHandler } from 'react';

type ButtonAndInputProps = {
    inputName: string;
    buttonName: string;
    inputType: React.HTMLInputTypeAttribute | undefined;
    inputPlaceHolder?: string;
    onClickButton: MouseEventHandler<HTMLButtonElement> | undefined;
    isDisabled?: boolean;
    isUsedPasswordButton?: boolean;
    formData?: any;
};

export const ButtonAndInput: React.FC<ButtonAndInputProps> = (props: ButtonAndInputProps) => {
    const { inputName, inputType, buttonName, inputPlaceHolder, formData } = props;
    const [show, setShow] = React.useState(false);
    const handleClick = () => setShow(!show);

    return (
        <Flex
            w="full"
            flexDirection={'column'}
            alignItems={'start'}
        >
            <Text                 
                paddingBottom={1} 
                fontFamily="Lato" 
                fontWeight={'bold'} 
                color="black"  
                fontSize="16px"
            >
                {inputName}
            </Text>
            <Flex w="full" gap ="10px" justifyContent="space-between">
                {props.isUsedPasswordButton == true ? (
                    <InputGroup size="sm">
                        <Input
                            variant="oauth"
                            placeholder={inputPlaceHolder}
                            type={show ? 'text' : 'password'}
                            isDisabled={props.isDisabled ?? false}
                            {...formData}
                        />
                        <InputRightElement
                            paddingRight={1}
                            alignItems="center"
                        >
                            <Button
                                variant="purple"
                                onClick={handleClick}
                                color={show ? 'black' : 'gray.200'}
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
                <Button
                    variant = "purple"
                    w= "80px"
                    h="full"  
                    onClick={props.onClickButton}>
                    {buttonName}
                </Button>
            </Flex>
        </Flex>
    );
};
