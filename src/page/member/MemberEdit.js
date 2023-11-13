import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  useToast,
} from "@chakra-ui/react";

export function MemberEdit() {
  /* 회원 상태 */
  const [member, setMember] = useState(null);
  /* email 상태 */
  const [email, setEmail] = useState("");
  /* email 중복 상태 */
  const [emailAvailable, setEmailAvailable] = useState(false);
  /* password 상태*/
  const [password, setPassword] = useState("");
  /* password 확인 상태 */
  const [passwordCheck, setPasswordCheck] = useState("");
  /* query string 가져오기 */
  const [params] = useSearchParams();
  /* 쿼리 스트링의 id 값 저장 */
  const id = params.get("id");
  /* ChakraUI toast */
  const toast = useToast();
  /* 회원 정보 요청 */
  useEffect(() => {
    axios.get("/api/member?" + params.toString()).then((response) => {
      /* 회원 정보 세팅 */
      setMember(response.data);
      /* 이메일 중복 확인을 위한 세팅 */
      setEmail(response.data.email);
    });
  }, []);

  /* 이메일 동일 여부 */
  let sameOriginEmail = false;

  /* */
  if (member !== null) {
    sameOriginEmail = member.email === email;
  }

  let emailChecked = sameOriginEmail || emailAvailable;

  /* 암호가 비어있으면 기존 암호 */
  /* 암호를 작성하면 새 암호, 암호 확인 체크 */
  let passwordChecked = false;

  if (passwordCheck === password) {
    passwordChecked = true;
  }

  if (password.length === 0) {
    passwordChecked = true;
  }

  if (member === null) {
    return <Spinner />;
  }

  /* 이메일 중복 체크 요청 */
  function handleEmailCheck() {
    const params = new URLSearchParams();
    params.set("email", email);

    axios
      .get("/api/member/check?" + params)
      .then(() => {
        setEmailAvailable(false);
        toast({
          description: "이미 사용 중인 email입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setEmailAvailable(true);
          toast({
            description: "사용 가능한 email입니다.",
            status: "success",
          });
        }
      });
  }

  /* 수정 제출 요청 */
  function handleSubmit() {
    axios.put("/api/member/edit", {
      id: member.id,
      password,
      email,
    });
  }

  return (
    <Box>
      <h1>{id}님 정보 수정</h1>
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>

      {/* password의 입력값이 있을 경우에만 출력 */}
      {password.length > 0 && (
        <FormControl>
          <FormLabel>password 확인</FormLabel>
          <Input
            type="text"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        </FormControl>
      )}
      {/*  email을 변경하면(작성시작) 중복확인 다시 하도록  */}
      {/*  기존 email과 같으면 중복확인 안해도됨 */}
      <FormControl>
        <FormLabel>email</FormLabel>
        <Flex>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailAvailable(false);
            }}
          />
          <Button isDisabled={emailChecked} onClick={handleEmailCheck}>
            중복확인
          </Button>
        </Flex>
      </FormControl>
      <Button
        isDisabled={!emailChecked || !passwordChecked}
        colorScheme="blue"
        onClick={handleSubmit}
      >
        수정
      </Button>
    </Box>
  );
}
