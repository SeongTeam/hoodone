import { CreateToastFnReturn, useToast } from '@chakra-ui/react';

export function showSuccessToast(
    toast: CreateToastFnReturn,
    content: { title: string; description?: string },
) {
    return toast({
        title: content.title,
        description: content.description,
        status: 'success',
        duration: 4000,
        isClosable: true,
    });
}

export function showErrorToast(
    toast: CreateToastFnReturn,
    content: { title: string; description?: string },
) {
    return toast({
        title: content.title,
        description: content.description,
        status: 'error',
        duration: 7000,
        isClosable: true,
    });
}

export function showWarringToast(
    toast: CreateToastFnReturn,
    content: { title: string; description?: string },
) {
    return toast({
        title: content.title,
        description: content.description,
        status: 'warning',
        duration: 7000,
        isClosable: true,
    });
}
