import { useNavigate, useSearchParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

export function MemberEdit() {
  /* 회원 상태 */
  const [member, setMember] = useState(null);
  /* email 상태, 중복 상태*/
  const [email, setEmail] = useState("");
  const [emailAvailable, setEmailAvailable] = useState(false);
  /* password 상태, 확인 상태 */
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  /* nickName 상태, 중복 상태 */
  const [nickName, setNickName] = useState("");
  const [nickNameAvailable, setNickNameAvailable] = useState("");

  /* 현재 페이지의 query string 가져오기 */
  const [params] = useSearchParams();
  /* 가져온 쿼리 스트링의 id 값 저장 */
  const id = params.get("id");

  /* ChakraUI */
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  /* 네비게이터 */
  const navigate = useNavigate();

  /* 회원 정보 요청 */
  useEffect(() => {
    axios.get("/api/member?" + params.toString()).then((response) => {
      /* 회원 정보 세팅 */
      setMember(response.data);
      /* 이메일 중복 확인을 위한 세팅 */
      setEmail(response.data.email);
      setNickName(response.data.nickName);
    });
  }, []);

  /* 이메일 동일 여부 */
  let sameOriginEmail = false;
  /* 닉네임 동일 여부 */
  let sameOriginNickName = false;

  /* 기존값과 동일 여부 체크 */
  if (member !== null) {
    sameOriginEmail = member.email === email;
    sameOriginNickName = member.nickName === nickName;
  }

  let emailChecked = sameOriginEmail || emailAvailable;
  let nickNameChecked = sameOriginNickName || nickNameAvailable;

  /* 암호가 유효한지 검증 */
  /* true일 때 수정 버튼 활성화 */
  let passwordChecked = false;
  /* 암호를 작성하면 새 암호, 암호 확인 체크 */
  if (passwordCheck === password) {
    passwordChecked = true;
  }
  /* 암호가 비어있으면 기존 암호 */
  if (password.length === 0) {
    passwordChecked = true;
  }

  if (member === null) {
    return <Spinner />;
  }
  /* 닉네임 중복 체크 요청 */
  function handleNickNameCheck() {
    const params = new URLSearchParams();
    /* 쿼리스트링에 닉네임 setting */
    params.set("nickName", nickName);

    axios
      .get("/api/member/check?" + params)
      .then(() => {
        setNickNameAvailable(false);
        toast({
          description: "이미 사용 중인 닉네임입니다.",
          status: "warning",
        });
      })
      .catch((error) => {
        if (error.response.status === 404) {
          setNickNameAvailable(true);
          toast({
            description: "사용 가능한 닉네임입니다.",
            status: "success",
          });
        }
      });
  }
  /* 이메일 중복 체크 요청 */
  function handleEmailCheck() {
    const params = new URLSearchParams();
    /* 쿼리스트링에 email setting */
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
    axios
      .put("/api/member/edit", {
        /* id, password, email 전송 */
        id: member.id,
        nickName,
        password,
        email,
      })
      .then(() => {
        toast({
          description: "회원정보가 수정되었습니다.",
          status: "success",
        });
        /* 회원 정보 페이지로 리다이렉트 */
        // navigate("/member?" + params.toString());
        navigate(-1);
      })
      .catch((error) => {
        if (error.response.status === 401 || error.response.status === 403) {
          toast({
            description: "수정 권한이 없습니다.",
            status: "error",
          });
        } else {
          toast({
            description: "수정중에 문제가 발생하였습니다.",
            status: "error",
          });
        }
      })
      .finally(() => onClose());
  }

  return (
    <Box>
      <h1>{id}님 정보 수정</h1>
      <FormControl>
        <FormLabel>nick name</FormLabel>
        <Flex>
          <Input
            type="text"
            value={nickName}
            /* nickName이 변경된 경우 nickName 값을 새로 설정하고, 중복 확인 로직 활성화 */
            onChange={(e) => {
              setNickName(e.target.value);
              setNickNameAvailable(false);
            }}
          />
          <Button isDisabled={nickNameChecked} onClick={handleNickNameCheck}>
            중복확인
          </Button>
        </Flex>
      </FormControl>
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormHelperText>
          비밀번호를 작성하지 않으면, 기존 비밀번호로 설정
        </FormHelperText>
      </FormControl>

      {/* password의 입력값이 있을 경우에만 생성 */}
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
            /* email이 변경된 경우 email 값을 새로 설정하고, 중복 확인 로직 활성화 */
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
      {/* 이메일 중복, 닉네임 중복 확인 및, password 확인 검증 완료 후 활성화 */}
      <Button
        isDisabled={!emailChecked || !nickNameChecked || !passwordChecked}
        colorScheme="blue"
        onClick={onOpen}
      >
        수정
      </Button>

      {/* 수정 모달 - Chackra UI */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>수정 확인</ModalHeader>
          <ModalCloseButton />
          <ModalBody>수정 하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>닫기</Button>
            <Button onClick={handleSubmit} colorScheme="red">
              수정
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
