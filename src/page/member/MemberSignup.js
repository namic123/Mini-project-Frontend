import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export function MemberSignup() {
  // 회원 상태 관리 (id, password, passwordCheck, email))
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const toast = useToast();
  const [emailAvailable, setEmailAvailable] = useState(false);

  // 중복 여부 체크를 위한 상태
  // true인 경우가 중복 값이 없음을 뜻함
  const [idAvailable, setIdAvailable] = useState(false);

  // 제출 조건 충족을 위한 변수
  // true인 경우에만 제출 가능
  let submitAvailable = true;

  // id가 중복된 경우
  if (!idAvailable) {
    submitAvailable = false;
  }
  if (!emailAvailable) {
    submitAvailable = false;
  }
  // 비밀번호 동일 여부 체크
  if (password != passwordCheck) {
    submitAvailable = false;
  }
  // 비밀번호 입력 여부 체크
  if (password.length === 0) {
    submitAvailable = false;
  }

  // Submit 폼
  function handleSubmit() {
    axios
      .post("/api/member/signup", {
        id,
        password,
        email,
      })
      .then(() => console.log("good"))
      .catch(() => console.log("bad"))
      .finally(() => console.log("done"));
  }

  // ID 중복여부 체크
  function handleDuplicate() {
    const searchParam = new URLSearchParams(); // query string을 설정하는 객체
    searchParam.set("id", id); // query string을 자동으로 encoding 해줌

    axios
      .get("/api/member/check?" + searchParam.toString())
      .then(() => {
        setIdAvailable(false);
        toast({
          description: "이미 사용중인 ID입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        //  존재하지 않는 아이디인 경우
        if (error.response.status === 404) {
          setIdAvailable(true);
          toast({
            description: "사용 가능한 ID입니다.",
            status: "success",
          });
        }
      });
  }

  function handleEmailCheck() {
    const params = new URLSearchParams();
    params.set("email", email);
    axios
      .get("/api/member/check?" + params)
      .then(() => {
        setEmailAvailable(false);
        toast({
          description: "이미 사용중인 email입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setEmailAvailable(true);
          toast({
            description: "사용 가능한 email입니다",
            status: "success",
          });
        }
      });
  }

  return (
    <Box>
      <h1>회원 가입</h1>
      <FormControl isInvalid={!idAvailable}>
        <FormLabel>id</FormLabel>
        <Flex>
          <Input
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setIdAvailable(false);
            }}
          />
          {/* 중복체크 */}
          <Button onClick={handleDuplicate}>중복 확인</Button>
        </Flex>
        <FormErrorMessage>ID 중복체크를 해주세요.</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={password.length === 0}>
        <FormLabel>password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormErrorMessage>암호를 입력해주세요.</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={password != passwordCheck}>
        <FormLabel>password 확인</FormLabel>
        <Input
          type="password"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
        />
        <FormErrorMessage>암호가 다릅니다.</FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!emailAvailable}>
        <FormLabel>email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailAvailable(false);
          }}
        />
        <Button onClick={handleEmailCheck}>중복체크</Button>
        <FormErrorMessage>email 중복 체크를 해주세요</FormErrorMessage>
      </FormControl>
      <Button
        isDisabled={!submitAvailable}
        onClick={handleSubmit}
        colorScheme="blue"
      >
        가입
      </Button>
    </Box>
  );
}
