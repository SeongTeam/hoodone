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
            marginBottom={0}
            paddingBottom={0}
            w="full"
            flexDirection={'column'}
            alignItems={'start'}
        >
            <Text paddingBottom={1} color="white" fontSize="20px" as="i">
                {inputName}
            </Text>
            <Flex w="592px" justifyContent="space-between">
                {props.isUsedPasswordButton == true ? (
                    <InputGroup size="md">
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
                            width="4.5rem"
                            height="4.5rem"
                        >
                            <Button
                                h="2.75rem"
                                size="sm"
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
                <Button variant="oauth" w="180px" h="70px" onClick={props.onClickButton}>
                    {buttonName}
                </Button>
            </Flex>
        </Flex>
    );
};
