import { Button, Flex, Input, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { AuthModalState } from "@/atoms/authModal";
import { customColors } from "@/utils/chakra/customColors";

/*TODO
- 이메일 인증 및 이메일 중복 검사 로직 구현
  - backend + front 모두 구현되어야함<div className=""></div>
*/
const SignUp: React.FC = () => {
  const [authModalState, setAuthModalState] = useRecoilState(AuthModalState);
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    conformPassword: "",
  });
  const [error, setError] = useState("");
  const [certification, setCertification] = useState(
    {
      state: false,
      code : "1234",
      inputCode: "",
    }
  );
  

  const createUserAccount = async (email: string, password: string) => {
    /*TODO
    - server Component fetch 로직 추가.
    */
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (error) setError("");

    if (signUpForm.password !== signUpForm.conformPassword) {
      setError("Password Do Not Match");
      return;
    }

    createUserAccount(signUpForm.email, signUpForm.password);
  };

  const onCertification = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (certification.inputCode !== certification.code ) {
      setError("Code Do Not Match");
      return;
    }
    setCertification((prev) => ({
      ...prev,
      state: true,
    }));
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if( event.target.name === "inputCode"){
      setCertification((prev) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }));
    }
    else{ 
      setSignUpForm((prev) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }));
    }
  };

  return (
    <>
      { certification.state === false ? (

          <form onSubmit={onCertification} className="form-modalPage">
            <Text textAlign="center" color={customColors.error[100]} fontSize="10px">
            {error}
            </Text>
            <Input variant="oauth"
              required
              name="email"
              placeholder="Email..."
              type="email"
              onChange={onChange}
            />
            <Flex w="592px" justifyContent="space-between">
              <Input variant="oauth"
                w="400px" h= "70px"
                required
                name="inputCode"
                placeholder="1234"
                type="text"
                onChange={onChange}
                />
              <Button variant="oauth"
                w="180px" h= "70px"
              >
                Send
              </Button>
            </Flex>
            <Button variant="oauth"
              type="submit">
              Confirm
            </Button>
          </form>
      ) : (

          <form onSubmit={onSubmit} className="form-modalPage">
            <Text textAlign="center" color="{customColors.error[100]}" fontSize="10px">
                {}
            </Text>
            <Input variant="oauth"
              required
              placeholder={signUpForm.email}
              type="email"
              isDisabled={true}
            />
            <Input variant="oauth"
              required
              name="username"
              placeholder="Username..."
              type="text"
            />
            <Input variant="oauth"
              required
              name="Password"
              placeholder="Password..."
              type="password"
              onChange={onChange}
            />
            <Input variant="oauth"
              required
              name="confirmPassword"
              placeholder="Confirm Password..."
              type="password"
              onChange={onChange}
            />
            <Button variant="oauth"
              type="submit"
            >
            Sign Up
            </Button>
          </form>
      )}
      <Flex marginTop={"40px"} w="100%" justify="space-between">
        <Text
          cursor="pointer"
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "login",
            }))
          }
        >
          login
        </Text>
        <Text
          cursor="pointer"
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "resetPassword",
            }))
          }
        >
          Forget ID/PW?
        </Text>
      </Flex>
    </>
  );
};
export default SignUp;
