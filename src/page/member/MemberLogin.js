/* 로그인 컴포넌트 */
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LogInProvider";

export function MemberLogin() {
  /* 아이디 */
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const toast = useToast();
  const { fetchLogin } = useContext(LoginContext);

  function handleLogin() {
    // TODO: 로그인 성공, 실패, 완료 코드 추가
    axios
      .post("/api/member/login", { id, password })
      .then(() => {
        toast({
          description: "로그인 되었습니다.",
          status: "info",
        });
        navigate("/");
      })
      .catch(() => {
        toast({
          description: "아이디와 암호를 다시 입력해주세요",
          status: "warning",
        });
      });
  }

  return (
    <>
      <Box marginTop={"130px"}>
        <Center>
          <Card
            w={"lg"}
            bgGradient={[
              "linear(to-tr, teal.300, yellow.400)",
              "linear(to-t, blue.200, teal.500)",
              "linear(to-b, orange.100, purple.300)",
            ]}
          >
            <CardHeader>
              <Heading>로그인</Heading>
            </CardHeader>
            <CardBody>
              <FormControl mb={5}>
                <FormLabel>아이디</FormLabel>
                <Input value={id} onChange={(e) => setId(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>암호</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
            </CardBody>
            <CardFooter>
              <Button colorScheme={"blue"} onClick={handleLogin}>
                로그인
              </Button>
            </CardFooter>
          </Card>
        </Center>
      </Box>
    </>
  );
}
