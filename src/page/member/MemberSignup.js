import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

/* 회원 가입 컴포넌트 */
/* 폼
 * 아이디
 * 비밀번호
 * 비밀번호 재확인
 * 이메일
 *  */
export function MemberSignup() {
  // 회원 폼 상태 관리
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const [nickName, setNickName] = useState("");

  // 중복 체크 상태
  const [idAvailable, setIdAvailable] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(false);
  const [nickNameAvailable, setNickNameAvailable] = useState(false);

  // Chakra UI toast 사용 - 팝업
  const toast = useToast();

  // react-router-dom, 다른 페이지로 이동 시키는 훅
  const navigate = useNavigate();

  // 제출 조건 충족 여부
  // true인 경우, 제출 가능 상태
  let submitAvailable = true;

  // 아이디 중복 또는 체크하지 않은 경우 제출 불가
  if (!idAvailable) {
    submitAvailable = false;
  }

  // 이메일 중복 또는 체크하지 않은 경우 제출 불가
  if (!emailAvailable) {
    submitAvailable = false;
  }
  // 닉네임 중복 또는 체크하지 않은 경우 제출 불가
  if (!nickNameAvailable) {
    submitAvailable = false;
  }

  // 비밀번호와 검증 폼이 같지 않은 경우 제출 불가
  if (password != passwordCheck) {
    submitAvailable = false;
  }

  // 비밀번호를 입력하지 않는 경우 제출 불가
  if (password.length === 0) {
    submitAvailable = false;
  }

  // 회원 가입 제출 폼
  function handleSubmit() {
    axios
      .post("/api/member/signup", {
        id,
        password,
        nickName,
        email,
      })
      .then(() => {
        // 요청 성공 값
        toast({
          description: "회원가입이 완료되었습니다",
          status: "success",
        });
        navigate("/");
      })
      .catch((error) => {
        // 요청 실패 값
        if (error.response.status === 400) {
          // 400 상태 코드, 클라이언트 오류.
          toast({
            description: "입력값을 확인해주세요.",
            status: "error",
          });
        } else {
          toast({
            // 서버 오류인 경우
            description: "가입중에 오류가 발생하였습니다.",
            status: "error",
          });
        }
      });
  }

  /* ID 중복 체크 검증 */
  function handleIdCheck() {
    /* Query String을 관리하기 위한 객체 생성 */
    const searchParam = new URLSearchParams();
    /* set의 1번째 인자에는 query의 key값이, 2번째 인자에는 value 값*/
    /* 예: id=1 */
    searchParam.set("id", id);

    axios
      .get("/api/member/check?" + searchParam.toString()) // Query String을 붙여서 get 요청 전송
      /* 중복 여부를 체크하는 폼이므로, 성공한 경우 중복된 ID가 있다는 것. */
      .then(() => {
        setIdAvailable(false); // false: ID폼 조건 불충족
        toast({
          description: "이미 사용 중인 ID입니다.",
          status: "warning",
        });
      })
      /* 중복된 ID가 없는 경우 */
      .catch((error) => {
        if (error.response.status === 404) {
          // 존재하지 않는 데이터 이므로 404(클라이언트 오류)를 반환
          setIdAvailable(true); // true : ID 폼 조건 만족
          toast({
            description: "사용 가능한 ID입니다.",
            status: "success",
          });
        }
      });
  }

  // email 중복 체크 검증
  function handleEmailCheck() {
    /* Query String을 관리하기 위한 객체 생성 */
    const params = new URLSearchParams();
    /* set의 1번째 인자에는 query의 key값이, 2번째 인자에는 value 값*/
    /* 예: email = example@naver.com */
    params.set("email", email);

    axios
      .get("/api/member/check?" + params) // Query String을 붙여서 get 요청 전송
      .then(() => {
        setEmailAvailable(false); // false: email폼 조건 불충족(이미 존재하는 email)
        toast({
          description: "이미 사용 중인 email입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          /* 존재하지 않는 데이터 이므로 404(클라이언트 오류)를 반환 */
          setEmailAvailable(true); // true : email 폼 조건 만족
          toast({
            description: "사용 가능한 email입니다.",
            status: "success",
          });
        }
      });
  }
  /* 닉네임 중복체크 */
  function handleNickNameCheck() {
    const params = new URLSearchParams();
    params.set("nickName", nickName);

    axios
      .get("/api/member/check?" + params)
      .then(() => {
        setNickNameAvailable(false); /* 이미 존재하는 nick name일 경우*/
        toast({
          description: "사용중인 닉네임입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          /* 존재하지 않는 데이터 이므로 404(클라이언트 오류)를 반환 */
          setNickNameAvailable(true); /* true : nickname 폼 조건 만족 */
          toast({
            description: "사용 가능한 nickname입니다.",
            status: "success",
          });
        }
      });
  }

  return (
    <Box>
      <Card
        md={"lg"}
        bgGradient={[
          "linear(to-tr, teal.300, yellow.400)",
          "linear(to-t, blue.200, teal.500)",
          "linear(to-b, orange.100, purple.300)",
        ]}
      >
        <CardHeader>
          <Heading>회원 가입</Heading>
        </CardHeader>
        <CardBody>
          {/* 아이디 폼 */}
          {/* 유효성 검사 속성, */}
          {/* true일 경우, 에러가 있는 것으로 표현 */}
          <FormControl marginButton={"50px"} isInvalid={!idAvailable}>
            <FormLabel>id</FormLabel>
            <Flex gap={2}>
              <Input
                value={id}
                onChange={(e) => {
                  setId(e.target.value);
                  setIdAvailable(false);
                }}
              />
              {/* 중복 검증 */}
              <Button
                onClick={handleIdCheck}
                bgGradient={[
                  "linear(to-tr, teal.300, yellow.400)",
                  "linear(to-t, blue.200, teal.500)",
                  "linear(to-b, orange.100, purple.300)",
                ]}
              >
                중복확인
              </Button>
            </Flex>
            <FormErrorMessage>ID 중복체크를 해주세요.</FormErrorMessage>
          </FormControl>
          {/* 닉네임 폼 */}
          <FormControl marginButton={"50px"} isInvalid={!nickNameAvailable}>
            <FormLabel>닉네임</FormLabel>
            <Flex gap={2}>
              <Input
                value={nickName}
                onChange={(e) => {
                  setNickNameAvailable(false);
                  setNickName(e.target.value);
                }}
              />
              {/* 중복 검증 */}
              <Button
                bgGradient={[
                  "linear(to-tr, teal.300, yellow.400)",
                  "linear(to-t, blue.200, teal.500)",
                  "linear(to-b, orange.100, purple.300)",
                ]}
                onClick={handleNickNameCheck}
              >
                중복확인
              </Button>
            </Flex>
            <FormErrorMessage>nick name 중복 체크를 해주세요.</FormErrorMessage>
          </FormControl>
          {/* 비밀번호 폼 */}
          {/* 값이 비어있는 경우, 에러메세지 출력 */}
          <FormControl marginButton={"50px"} isInvalid={password.length === 0}>
            <FormLabel>password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <FormErrorMessage>암호를 입력해 주세요.</FormErrorMessage>
          </FormControl>

          {/* 비밀번호 재확인 폼 */}
          {/* 비밀번호 폼과 값이 다른 경우, 에러메세지 출력 */}
          <FormControl
            marginButton={"50px"}
            isInvalid={password != passwordCheck}
          >
            <FormLabel>password 확인</FormLabel>
            <Input
              type="password"
              value={passwordCheck}
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
            <FormErrorMessage>암호가 다릅니다.</FormErrorMessage>
          </FormControl>
          {/* 이메일 폼 */}
          {/* 이메일 중복 체크 여부 검증 */}
          <FormControl marginButton={"50px"} isInvalid={!emailAvailable}>
            <FormLabel>email</FormLabel>
            <Flex gap={2}>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmailAvailable(false);
                  setEmail(e.target.value);
                }}
              />

              {/* 중복 체크 검증 */}
              <Button
                bgGradient={[
                  "linear(to-tr, teal.300, yellow.400)",
                  "linear(to-t, blue.200, teal.500)",
                  "linear(to-b, orange.100, purple.300)",
                ]}
                onClick={handleEmailCheck}
              >
                중복확인
              </Button>
            </Flex>
            <FormErrorMessage>email 중복 체크를 해주세요.</FormErrorMessage>
          </FormControl>
        </CardBody>

        <CardFooter>
          {/* 제출 버튼 */}
          {/* 각 폼의 조건이 맞지 않은 경우, 버튼 비활성화 */}
          <Button
            isDisabled={!submitAvailable} // 제출 조건이 유효하지 않은 경우
            onClick={handleSubmit}
            colorScheme="blue"
          >
            가입
          </Button>
        </CardFooter>
      </Card>
    </Box>
  );
}
