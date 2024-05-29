import { Button, Flex, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';
import React from 'react';
import { MouseEventHandler } from 'react';

type CommonInputProps = {
    inputName: string;
    inputType: React.HTMLInputTypeAttribute | undefined;
    inputPlaceHolder?: string;
    isDisabled?: boolean;
    formData?: any;
};

export const CommonInput: React.FC<CommonInputProps> = (props: CommonInputProps) => {
    const { inputName, inputType, inputPlaceHolder, formData } = props;

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
            {inputType === 'password' ? (
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
        </Flex>
    );
};
