import { customColors } from '@/utils/chakra/customColors';
import { Box, Flex, IconButton } from '@chakra-ui/react';
import { Icon } from '@iconify-icon/react';
import React from 'react';
import { useRouter } from 'next/navigation';
import { RouteTable } from '@/components/sidebar/SideBarRoute';

/*TODO
= Icon 위치 조정 hardcode하지 말기 */

const UserMenuIcons: React.FC = () => {
    const color = customColors.black[100];
    const reactColor = customColors.purple[100];
    const router = useRouter();

    const handleCreateButtonClick = () => {
        router.push(RouteTable.QuestRoute.create)
    }


    return (
        <Box>
            <Flex alignItems={'baseline'}>
                <IconButton 
                    bg='inherit'
                    aria-label='create icon'
                    border = "none"
                    color = {color}
                    icon = {<Icon style={{position: 'relative', top: '-8px'}} icon="ion:create-outline" width="30px" height="30px" />}
                    _focus = {{border: 'none' , bg: 'none' }}
                    _hover = {{bg: 'none', color : reactColor}}
                    onClick={() => handleCreateButtonClick()}
                    />
                <IconButton 
                    bg='inherit'
                    aria-label='notification icon'
                    color = {color}
                    border = "none"
                    icon = {<Icon style={{position: 'relative', top: '-8px'}} icon="carbon:notification" width="30px" height="30px" />}
                    _focus = {{border: 'none' , bg: 'none' }}
                    _hover = {{bg: 'none' , color : reactColor}}
                    onClick={() => alert ("Notify functionality is not implemented yet.")}
                    />
            </Flex>
        </Box>
    );
};
export default UserMenuIcons;
