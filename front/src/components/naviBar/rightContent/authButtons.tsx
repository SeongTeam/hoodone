import { IconButton ,Flex, Image } from "@chakra-ui/react";
import React from "react";

import { useSetRecoilState } from "recoil";
import { AuthModalState } from "@/atoms/authModal";


/*TODO
- Auth state관리하기 
    - Recoil stae management 사용 고려
 */
const AuthButtons: React.FC = () => {
  const setAuthModalState = useSetRecoilState(AuthModalState);

  return (
      <IconButton
        w="230px"
        h="65px"
        display={{ base: "none", sm: "flex" }}
        rounded="20px"
        ml="80px"
        icon={<Image src="/hood1/loginIcon.svg" alt="login icon" />}
        aria-label="Show Login Modal"
        onClick={() => setAuthModalState({ isOpen: true, view: "login" })}
      >
      </IconButton>
  );
};
export default AuthButtons;
